import { NextResponse } from "next/server";
import {
  getSanityRedirects,
  matchRedirect,
  STATIC_REDIRECTS,
} from "@/lib/sanity/redirects";
import { isSiteHostname, SITE_URL } from "@/utils/siteUrl";

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") || request.nextUrl.host;
  const hostname = host.split(":")[0];
  const protocol = request.nextUrl.protocol;
  if (isSiteHostname(hostname) && `${protocol}//${host.toLowerCase()}` !== SITE_URL) {
    return NextResponse.redirect(`${SITE_URL}${pathname}${search}`, 308);
  }

  if (pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return NextResponse.next();
  }
  const redirect =
    matchRedirect(STATIC_REDIRECTS, pathname, search) ||
    matchRedirect(await getSanityRedirects(), pathname, search);

  if (!redirect) return NextResponse.next();

  const destination = redirect.destination.startsWith("http")
    ? redirect.destination
    : new URL(redirect.destination, request.url);

  return NextResponse.redirect(destination, redirect.permanent ? 301 : 302);
}

export const config = {
  matcher: ["/robots.txt", "/sitemap.xml", "/((?!_next/static|_next/image|studio|api|favicon.ico|.*\\..*).*)"],
};
