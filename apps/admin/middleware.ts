import { NextResponse, type NextRequest } from "next/server";
import { verifySession, COOKIE } from "@maple/core/lib/session";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const token = req.cookies.get(COOKIE)?.value;
  const user = token ? await verifySession(token) : null;
  if (!user) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const url = req.nextUrl.clone(); url.pathname = "/login"; url.searchParams.set("next", (req.headers.get("x-forwarded-host") ? `https://${req.headers.get("x-forwarded-host")}` : req.nextUrl.origin) + pathname + search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/((?!login|api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|ico|webp|mp4)).*)"] };
