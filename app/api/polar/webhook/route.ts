import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

const webhookSecret = process.env.POLAR_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Polar-Signature") as string

  // Verify the webhook signature
  // Note: This is a simplified example. In production, you should properly verify the signature
  // using Polar's SDK or following their documentation
  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 })
  }

  let event
  try {
    event = JSON.parse(body)
  } catch (error) {
    return new NextResponse("Invalid JSON", { status: 400 })
  }

  const supabase = await createServerClient()

  try {
    switch (event.type) {
      case "subscription.created":
      case "subscription.updated": {
        const subscription = event.data
        const customerId = subscription.customer_id

        // Get the user with this Polar customer ID
        const { data: users } = await supabase
          .from("users_metadata")
          .select("user_id")
          .eq("polar_customer_id", customerId)
          .limit(1)

        if (!users || users.length === 0) {
          console.error("No user found with Polar customer ID:", customerId)
          return new NextResponse("User not found", { status: 404 })
        }

        const userId = users[0].user_id

        // Get the product details
        const productResponse = await fetch(
          `${process.env.POLAR_API_URL}/products/${subscription.items[0].price.product_id}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.POLAR_API_KEY}`,
            },
          },
        )

        if (!productResponse.ok) {
          throw new Error("Failed to fetch product details")
        }

        const product = await productResponse.json()

        // Determine the subscription tier from product metadata
        const tier = product.metadata?.tier || "free"

        // Update or create subscription in your database
        const { error } = await supabase.from("subscriptions").upsert({
          id: subscription.id,
          user_id: userId,
          status: subscription.status,
          tier,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
          created_at: new Date(subscription.created * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (error) {
          console.error("Error updating subscription:", error)
          return new NextResponse("Error updating subscription", { status: 500 })
        }

        break
      }

      case "subscription.deleted": {
        const subscription = event.data

        // Delete or mark as canceled in your database
        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("id", subscription.id)

        if (error) {
          console.error("Error canceling subscription:", error)
          return new NextResponse("Error canceling subscription", { status: 500 })
        }

        break
      }
    }

    return new NextResponse(JSON.stringify({ received: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return new NextResponse("Webhook handler failed", { status: 500 })
  }
}
