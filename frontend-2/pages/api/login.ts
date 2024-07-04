import { API } from "@/utils/constants";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const response = await fetch(`${API}/get-next-token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    // Unsuccessful requests
    if (!response.ok) {
      return res.status(400).json(await response.json());
    }

    // Successful requests
    const data = await response.json();
    res.setHeader("Set-Cookie", [
      `accessToken=${data.access}; Path=/; HttpOnly; Max-Age=864000; SameSite=Strict`,
      `expiresAt=${data.expires_at}; Path=/; HttpOnly; Max-Age=864000; SameSite=Strict`,
      `username=${data.username}; Path=/; HttpOnly; Max-Age=864000; SameSite=Strict`,
    ]);

    return res.status(200).json(data);
  }

  // Non-post requests
  return res.status(405).json({ detail: "Method not allowed." });
}
