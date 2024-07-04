import { API } from "@/utils/constants";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const res = await request.json();

  const djangoResponse = await fetch(`${API}/get-next-token/`, {
    cache: "no-store",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(res),
  });

  if (!djangoResponse.ok) {
    return NextResponse.json(await djangoResponse.json(), {
      status: djangoResponse.status,
    });
  }
  const data = await djangoResponse.json();

  const response = new Response();

  response.headers.set(
    "Set-Cookie",
    `accessToken=${data.access}; Path=/; HttpOnly; Max-Age=864000; SameSite=Strict; 
    expiresAt=${data.expires_at}; Path=/; HttpOnly; Max-Age=864000; SameSite=Strict
    username=${data.username}; Path=/; HttpOnly; Max-Age=864000; SameSite=Strict`
  );
  return response;
}
