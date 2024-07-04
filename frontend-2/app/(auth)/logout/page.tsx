import { Metadata } from "next";
import LogoutForm from "./LogoutForm";

export const metadata: Metadata = {
  title: "Log out - Trackedfitness",
  description: "Log out of your Trackedfitness user account",
};

export default function LogoutPage() {
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">Log out</h1>

      <p className="mb-4">Are you sure you wish to log out?</p>
      <LogoutForm />
    </div>
  );
}
