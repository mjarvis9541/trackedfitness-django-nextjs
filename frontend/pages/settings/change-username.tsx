import Head from "next/head";
import ChangeUsernameForm from "../../app/accounts/ChangeUsernameForm";

const ChangeUsername = () => {
  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Change Username - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Change username - Trackedfitness" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-xl font-bold">Change Username</h1>

      <ChangeUsernameForm />
    </div>
  );
};

export default ChangeUsername;
