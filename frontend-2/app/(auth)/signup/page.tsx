import { Metadata } from "next";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign up - Trackedfitness",
  description: "Sign up for a Trackedfitness user account",
};

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center">
      <div className="mt-40 min-w-[50%] rounded bg-zinc-700 p-8">
        <h1 className="mb-8 text-2xl font-bold">Sign up</h1>

        <div>
          <SignUpForm />
        </div>

        <div className="mb-4 pt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
