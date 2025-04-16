import { clerkMiddleware, auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface PublicMetadata {
  role?: string;
}

export default clerkMiddleware(async (auth, req) => {
  // Check if the request is for an admin route
  if (req.nextUrl.pathname.startsWith("/admin-shield")) {
    const authObj = await auth();

    if (!authObj.userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Get user's public metadata to check admin role
    const sessionClaims = authObj.sessionClaims;
    const publicMetadata = sessionClaims?.publicMetadata as
      | PublicMetadata
      | undefined;
    const isAdmin = publicMetadata?.role === "admin";

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
