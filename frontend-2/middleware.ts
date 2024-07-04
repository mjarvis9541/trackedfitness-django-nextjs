import { NextRequest, NextResponse } from "next/server";

export function isAuthorized(request: NextRequest) {
  const expiresAt = request.cookies.get("expiresAt")?.value;
  if (!request.cookies.has("accessToken")) {
    return false;
  }
  if (Date.now() >= expiresAt * 1000) {
    return false;
  }
  return true;
}

export function middleware(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - login
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|login|_next/static|_next/image|favicon.ico).*)",
  ],
};
