import { Metadata } from "next";
import ResendActivationForm from "./ResendActivationForm";

export const metadata: Metadata = {
  title: "Resend Activation Email - Trackedfitness",
  description: "Resend Trackedfitness user account activation email",
};

export default function ResendActivationEmailPage() {
  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Resend Activation Email</h1>
      <ResendActivationForm />
    </div>
  );
}
