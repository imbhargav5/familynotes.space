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

    const { returnUrl } = await req.json()

    if (!returnUrl) {
      return new NextResponse("Missing return URL", { status: 400 })
    }

    // Get the user's Polar customer ID
    const { data: userMetadata } = await supabase
      .from("users_metadata")
      .select("polar_customer_id")
      .eq("user_id", user.id)
      .single()

    if (!userMetadata?.polar_customer_id) {
      return new NextResponse("No Polar customer found", { status: 404 })
    }

    // Create a billing portal session with Polar
    const portalResponse = await fetch(`${process.env.POLAR_API_URL}/customer-portal-sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.POLAR_API_KEY}`,
      },
      body: JSON.stringify({
        customer_id: userMetadata.polar_customer_id,
        return_url: returnUrl,
      }),
    })

    if (!portalResponse.ok) {
      throw new Error("Failed to create portal session")
    }

    const session = await portalResponse.json()

    return new NextResponse(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error creating portal session:", error)
    return new NextResponse("Error creating portal session", { status: 500 })
  }
}
