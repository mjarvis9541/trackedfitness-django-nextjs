import Head from "next/head";
import Link from "next/link";
import SignupForm from "../../app/accounts/SignupForm";

export default function signup() {
  return (
    <div className="px-4">
      <Head>
        <title>Sign up - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Sign up - Trackedfitness" />
      </Head>

      <h1 className="my-4 text-2xl font-bold">Sign up</h1>

      <SignupForm />

      <p className="my-2">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
