import Head from "next/head";

const ChangeEmailSent = () => {
  return (
    <div className="p-2">
      <Head>
        <title>Change Email Verification Email Sent - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Change email verification email sent - Trackedfitness"
        />
      </Head>

      <h2>Verification Email Sent</h2>

      <p>
        We have sent confirmation to the email address provided, please click on
        the link within the email to update your email address.
      </p>

      <p>
        If you don not receive an email, please make sure you have entered the
        correct email address, and check your spam/junk folder.
      </p>
    </div>
  );
};

export default ChangeEmailSent;
