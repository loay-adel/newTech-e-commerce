// middleware.js (in root of your Next.js project)
import { NextResponse } from "next/server";

export function middleware(request) {
  // Get token from cookies (not localStorage, as middleware runs on server)
  const token = request.cookies.get("token")?.value;

  // Protect these routes
  if (request.nextUrl.pathname.startsWith("/checkout") && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/profile") && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (request.nextUrl.pathname.startsWith("/orders") && !token) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/profile/:path*", "/orders/:path*"],
};
