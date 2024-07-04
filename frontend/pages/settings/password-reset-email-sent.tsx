import Head from "next/head";
import Link from "next/link";

const PasswordResetEmailSent = () => {
  return (
    <div>
      <Head>
        <title>Password Reset Email Sent - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Password reset email sent - Trackedfitness"
        />
      </Head>

      <h1>Password Reset Email Sent</h1>

      <p>
        We have sent an email to the email address you provided with a link to
        reset your password. If the email address belongs to a valid account,
        you should receive instructions on how to reset your password shortly.
      </p>

      <Link href="/login">Log in</Link>
    </div>
  );
};

export default PasswordResetEmailSent;
