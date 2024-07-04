import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Set-Cookie", [
    `accessToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict`,
    `expiresAt=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict`,
    `username=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict`,
  ]);
  return res.status(200).json("ok");
}
