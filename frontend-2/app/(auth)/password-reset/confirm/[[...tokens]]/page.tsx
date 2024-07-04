import { API } from "@/utils/constants";
import { Metadata } from "next";
import Link from "next/link";
import PasswordResetConfirmForm from "../../PasswordResetConfirmForm";

export const metadata: Metadata = {
  title: "Password Reset Confirmation - Trackedfitness",
};

async function activate({ tokens }: { tokens?: any }) {
  const [uid, activationToken] = tokens;

  const res = await fetch(`${API}/users/password-reset-confirm/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid: uid, token: activationToken }),
  });
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export default async function ActivatePage({
  params: tokens,
}: {
  params: { tokens?: string[] };
}) {
  if (!tokens)
    return (
      <div>
        <h1 className="text-2xl font-bold">Activate Account</h1>
        <p>No activation token received.</p>
        <p>
          If you wish to create an account <Link href="/">click here</Link>.
        </p>

        <p>Return Home</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Activate Account</h1>
      <p>Enter your email below to request a new account activation token.</p>
      <div className="max-w-md">
        <PasswordResetConfirmForm />
      </div>
    </div>
  );
}
