// src/app/api/stripe/route.ts
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { userSubscription } from "@/lib/db/schema";
import { stripe } from "@/lib/stripe";

const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}` || "/";

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const user = await currentUser();

    // Check if this user already has a subscription record
    const _userSubscription = await db
      .select()
      .from(userSubscription)
      .where(eq(userSubscription.userId, userId));

    // Case 1: existing subscriber → send them to Stripe's billing portal
    if (_userSubscription[0]?.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: _userSubscription[0].stripeCustomerId,
        return_url: returnUrl,
      });

      return NextResponse.json({ url: stripeSession.url });
    }

    // Case 2: new subscriber → create a fresh checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: returnUrl,
      cancel_url: returnUrl,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user?.emailAddresses[0]?.emailAddress,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });

    console.log("strp--", stripeSession.url);

    return NextResponse.json({ url: stripeSession.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
