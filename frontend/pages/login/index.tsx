import Head from "next/head";
import Link from "next/link";
import LoginForm from "../../app/accounts/LoginForm";

export default function login() {
  return (
    <div className="px-4">
      <Head>
        <title>Log in - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Log in - Trackedfitness" />
      </Head>

      <h1 className="my-4 text-2xl font-bold">Log in</h1>

      <LoginForm />

      <p className="my-2">
        <Link
          href="/settings/password-reset"
          className="text-blue-600 hover:underline"
        >
          Forgot password?
        </Link>
      </p>

      <p className="my-2">
        Need an account?{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
