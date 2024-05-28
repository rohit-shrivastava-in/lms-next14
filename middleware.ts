import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs/server";

export default authMiddleware({
    publicRoutes: ['/', '/search', '/uploadthing'],
    afterAuth(auth, req, evt) {
        // Handle users who aren't authenticated
        if (!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({ returnBackUrl: req.url });
        }

        // If the user is signed in and trying to access a protected route, allow them to access route
        if (auth.userId && !auth.isPublicRoute) {
            return NextResponse.next();
        }
        // Allow users visiting public routes to access them
        return NextResponse.next();
    },
});

export const config = {
    // Protects all routes, including api/trpc.
    // See https://clerk.com/docs/references/nextjs/auth-middleware
    // for more information about configuring your Middleware
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};