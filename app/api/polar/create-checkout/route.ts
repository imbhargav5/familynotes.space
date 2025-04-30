import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function POST(req: Request) {
  try {
    const supabase = await createServerClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { priceId, successUrl, cancelUrl } = await req.json()

    if (!priceId || !successUrl || !cancelUrl) {
      return new NextResponse("Missing required parameters", { status: 400 })
    }

    // Check if user already has a Polar customer ID
    const { data: userMetadata } = await supabase
      .from("users_metadata")
      .select("polar_customer_id")
      .eq("user_id", user.id)
      .single()

    let customerId: string

    if (userMetadata?.polar_customer_id) {
      customerId = userMetadata.polar_customer_id
    } else {
      // Create a new customer in Polar
      const customerResponse = await fetch(`${process.env.POLAR_API_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.POLAR_API_KEY}`,
        },
        body: JSON.stringify({
          email: user.email,
          metadata: {
            user_id: user.id,
          },
        }),
      })

      if (!customerResponse.ok) {
        throw new Error("Failed to create Polar customer")
      }

      const customer = await customerResponse.json()
      customerId = customer.id

      // Save the customer ID to the database
      await supabase.from("users_metadata").upsert({
        user_id: user.id,
        polar_customer_id: customerId,
      })
    }

    // Create a checkout session with Polar
    const sessionResponse = await fetch(`${process.env.POLAR_API_URL}/checkout-sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.POLAR_API_KEY}`,
      },
      body: JSON.stringify({
        customer_id: customerId,
        line_items: [
          {
            price_id: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
      }),
    })

    if (!sessionResponse.ok) {
      throw new Error("Failed to create checkout session")
    }

    const session = await sessionResponse.json()

    return new NextResponse(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return new NextResponse("Error creating checkout session", { status: 500 })
  }
}
