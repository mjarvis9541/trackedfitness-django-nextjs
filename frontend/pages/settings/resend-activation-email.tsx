import Head from "next/head";
import ResendActivationForm from "../../app/accounts/ResendActivationForm";

const ResendActivationEmail = () => {
  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Resend Activation Email - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Resend Activation Email - Trackedfitness"
        />
      </Head>

      <h1 className="text-xl font-bold">Resend Activation Email</h1>

      <p>
        Enter your email address below and we will send you a new activation
        email if your account has not yet been activated.
      </p>

      <ResendActivationForm />
    </div>
  );
};

export default ResendActivationEmail;
