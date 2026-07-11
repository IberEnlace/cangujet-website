import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const url = new URL(`/qr-contact${request.nextUrl.search}`, request.url);
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: ["/index.php/contact", "/index.php/contact/"],
};
