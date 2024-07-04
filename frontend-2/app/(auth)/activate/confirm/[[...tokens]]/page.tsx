import { API } from "@/utils/constants";
import Link from "next/link";
import ResendActivationForm from "../../ResendActivationForm";

type ActivationData = {
  id: string;
  username: string;
  email: string;
};

async function activate({ tokens }: { tokens?: any }): Promise<ActivationData> {
  const [uid, activationToken] = tokens;

  const res = await fetch(`${API}/users/activate/`, {
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
  if (Array.isArray(tokens) && tokens.length == 2) {
    const data = await activate({ tokens });

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Activate Account</h1>
        <p>Account activated successfully.</p>
      </div>
    );
  }

  if (!tokens)
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Activate Account</h1>
        <p>No activation token received.</p>
        <p>
          If you wish to create an account <Link href="/">click here</Link>.
        </p>

        <p>Return Home</p>
      </div>
    );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Activate Account</h1>
      <p>Enter your email below to request a new account activation token.</p>
      <div className="max-w-md">
        <ResendActivationForm />
      </div>
    </div>
  );
}
