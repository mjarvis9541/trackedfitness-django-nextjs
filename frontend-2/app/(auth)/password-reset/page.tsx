import { Metadata } from "next";
import PasswordResetForm from "./PasswordResetForm";

export const metadata: Metadata = {
  title: "Reset Password - Trackedfitness",
  description: "Reset your Trackedfitness user account password",
};

export default function PasswordResetPage() {
  return (
    <div className="p-4">
      <h1 className="text-1xl font-bold">Reset Password</h1>
      <PasswordResetForm />
    </div>
  );
}
