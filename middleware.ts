import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/", // landing page
  "/sign-in(.*)", // Clerk sign-in and its sub-routes
  "/sign-up(.*)", // Clerk sign-up and its sub-routes
  "/api/webhook(.*)", // Stripe webhook must stay public — Stripe isn't a signed-in user
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect(); // require sign-in for everything NOT listed as public
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/__clerk/:path*",
    "/(api|trpc)(.*)",
  ],
};
