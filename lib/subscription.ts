// src/lib/subscription.ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { userSubscription } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export async function checkSubscription(): Promise<boolean> {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  const _userSubscription = await db
    .select()
    .from(userSubscription)
    .where(eq(userSubscription.userId, userId));

  const subscription = _userSubscription[0];

  if (!subscription) {
    return false;
  }

  // Valid if they have a price AND their period end is still in the future
  // (with a 1-day grace buffer in case of clock skew or slow webhook processing)
  const isValid =
    subscription.stripePriceId &&
    subscription.stripeCurrentPeriodEnd &&
    subscription.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS > Date.now();

  return !!isValid;
}
