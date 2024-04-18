import { NextMiddleware, NextResponse } from "next/server";

export const middleware: NextMiddleware = async (req) => {
  //   const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const url = req.nextUrl.clone();
  url.pathname = `/home`;

  return NextResponse.redirect(url);
};

export const config = {
  matcher: "/",
};
