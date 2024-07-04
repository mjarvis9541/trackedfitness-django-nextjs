import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

const EmailChangeComplete = () => {
  const router = useRouter();
  const { uid, token } = router.query;

  useEffect(() => {
    // router.push("/users/email/change/complete", undefined, { shallow: true });
    if (typeof window !== "undefined") {
      localStorage.setItem("emailChangeLinkClicked", true);
    }
  }, []);

  useEffect(() => {
    if (!uid || !token) return;

    if (typeof window !== "undefined") {
      if (localStorage.getItem("emailChangeComplete")) return;
    }

    const fetcher = async () => {
      const res = await fetch(
        `${process.env.API}/users/email/change/complete/`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid, token }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log("error");
        // handle error - RENDER FAIL JSX
      }
      if (res.ok) {
        console.log("ok");
        // localStorage.setItem("emailChange", true);
        // Handle success - RENDER SUCCESS JSX
        // complete
      }
    };
    fetcher();
  }, [uid, token]);

  return (
    <>
      <Head>
        <title>Email Address Updated - Trackedfitness</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <h1>Email Address Updated</h1>

        <p>
          Your email address has been updated sucessfully. You will now need to
          use [EMAIL] to log in to the site.
        </p>

        <p>You can now continue using the app.</p>
      </div>
    </>
  );
};

export default EmailChangeComplete;
