import Head from "next/head";
import LogoutForm from "../../app/accounts/LogoutForm";

export default function logout() {
  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Log out - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Log out - Trackedfitness" />
      </Head>

      <h1 className="text-xl font-bold">Log out</h1>

      <p>Are you sure you wish to log out?</p>

      <LogoutForm />
    </div>
  );
}
