import { NextResponse, type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // const res = await request.json();
  // const token = request.cookies.get("token");

  const response = NextResponse.json({ data: "ok" });

  // response.cookies.delete("token");
  response.cookies.set("token", "", {
    path: "/",
    maxAge: -1,
    sameSite: "none",
    httpOnly: true,
    secure: true,
  });
  return response;
}
