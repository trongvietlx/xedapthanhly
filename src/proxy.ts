import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "admin_session";
const LOGIN_PATH = "/admin/login";
const DEFAULT_REDIRECT_PATH = "/admin/orders";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get(AUTH_COOKIE_NAME)?.value === "true";

  if (pathname === LOGIN_PATH) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(DEFAULT_REDIRECT_PATH, request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
