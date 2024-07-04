import Head from "next/head";
import ChangePasswordForm from "../../app/accounts/ChangePasswordForm";

const ChangePassword = () => {
  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Change Password - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Change password - Trackedfitness" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-xl font-bold">Change Password</h1>

      <p>
        Change your password below. If you have forgotten your current password,
        you can reset it using link at the bottom of the page.
      </p>

      <ChangePasswordForm />
    </div>
  );
};

export default ChangePassword;
