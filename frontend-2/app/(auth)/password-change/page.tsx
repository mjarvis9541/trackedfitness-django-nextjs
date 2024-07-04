import { Metadata } from "next";
import { cookies } from "next/headers";
import PasswordChangeForm from "./PasswordChangeForm";

export const metadata: Metadata = {
  title: "Change Password - Trackedfitness",
  description: "Change your Trackedfitness user account password",
};

export default function PasswordChangePage() {
  const token = cookies().get("accessToken")?.value;

  return (
    <div>
      <h1 className="text-xl font-bold">Password Change</h1>
      <div className="max-w-sm">
        <PasswordChangeForm token={token} />
      </div>
    </div>
  );
}
