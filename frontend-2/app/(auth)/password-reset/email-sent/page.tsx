import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Email Sent - Trackedfitness",
};

export default function PasswordResetEmailSentPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Password Reset Email Sent</h1>
      <p>You should receive an email shortly with a password reset link.</p>
      <p>
        <Link href="/login" className="text-blue-500 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
