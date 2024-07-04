import { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log in - Trackedfitness",
  description: "Log in to your Trackedfitness user account",
};

export default function LoginPage() {
  return (
    <div className="p-4">
      <div className="min-w-[50%] rounded bg-zinc-700 p-8">
        <h1 className="mb-4 text-2xl font-bold">Log in</h1>

        <div>
          <LoginForm />
        </div>

        <div className="mt-4 mb-2">
          <Link
            href="/password-reset"
            className="text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="pb-8">
          Need an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
