import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define public paths that don't require authentication
const publicPaths = ['/', '/login', '/signup'];

export default withAuth(
  function middleware(req) {
    // Add custom headers or logic here if needed
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Allow access to public paths without token
        if (publicPaths.includes(req.nextUrl.pathname)) {
          return true;
        }
        // Require token for all other paths
        return token !== null;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/explore/:path*',
    '/create-request/:path*',
    '/request/:path*',
    '/profile/:path*',
    '/messages/:path*',
    '/notifications/:path*',
    '/leaderboard/:path*',
    '/ai-center/:path*',
    '/onboarding/:path*',
    '/admin/:path*',
  ],
};
