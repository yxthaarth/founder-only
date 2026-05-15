import { NextRequest, NextResponse } from "next/server";
import { LOGIN_PATH, ONBOARDING_PATH } from "@/lib/constants";

const PUBLIC_PATHS = [LOGIN_PATH, ONBOARDING_PATH, "/auth/callback", "/_next", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path + "/"))) {
    return NextResponse.next();
  }

  const authenticated = request.cookies.get("fo_auth")?.value;
  const onboardingStatus = request.cookies.get("fo_onboarding_status")?.value;

  if (authenticated !== "1") {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  if (onboardingStatus !== "complete") {
    const url = request.nextUrl.clone();
    url.pathname = ONBOARDING_PATH;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image).*)"]
};
