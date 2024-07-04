import { Metadata } from "next";
import { cookies } from "next/headers";
import EmailChangeForm from "./EmailChangeForm";

export const metadata: Metadata = {
  title: "Change Email - Trackedfitness",
  description: "Change your Trackedfitness user account email address",
};

export default function EmailChangePage() {
  const token = cookies().get("accessToken")?.value;
  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Change Email</h1>
      <EmailChangeForm token={token} />
    </div>
  );
}
