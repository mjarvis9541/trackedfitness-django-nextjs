import Head from "next/head";
import Link from "next/link";

export default function SignupEmailSent() {
  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Activation Email Sent - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Activation email sent - Trackedfitness"
        />
      </Head>

      <h1 className="text-2xl font-bold">Activation Email Sent</h1>

      <p>
        We have sent you an email with an activation link to activate your
        account.
      </p>

      <p>Please check your email and click on the link provided.</p>

      <div>
        <Link href="/login" className="text-blue-600 hover:underline">
          Click here to log in
        </Link>
      </div>
    </div>
  );
}
