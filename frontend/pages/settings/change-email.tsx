import Head from "next/head";
import ChangeEmailForm from "../../app/accounts/ChangeEmailForm";

const ChangeEmail = () => {
  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Change Email - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Change email - Trackedfitness" />
      </Head>

      <h1 className="text-xl font-bold">Change Email</h1>

      <p>
        To change your email address, enter your new email address below, and we
        will send a link to your new email address to confirm.
      </p>

      <ChangeEmailForm />
    </div>
  );
};

export default ChangeEmail;
