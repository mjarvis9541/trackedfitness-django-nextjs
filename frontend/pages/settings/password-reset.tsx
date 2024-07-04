import Head from "next/head";
import PasswordResetForm from "../../app/accounts/PasswordResetForm";

const PasswordReset = () => {
  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Password Reset - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Password reset - Trackedfitness" />
      </Head>

      <h1 className="text-xl font-bold">Password Reset</h1>

      <p>
        Enter the email address associated with your account, if you have an
        active account well send you a link to reset your password.
      </p>

      <PasswordResetForm />
    </div>
  );
};

export default PasswordReset;
