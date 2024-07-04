import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import useActivate from "../../../../../app/accounts/useActivate";
import FormAPIError from "../../../../../components/FormAPIError";
import { UserContext } from "../../../../../contexts/UserContext";

const Activate = () => {
  const router = useRouter();
  const { uid, token } = router.query;
  const { user, setUser } = useContext(UserContext);
  const [apiErrors, setApiErrors] = useState([]);

  const mutation = useActivate({ uid, token });

  useEffect(() => {
    if (!uid || !token) return;

    ((data) => {
      mutation.mutate(data, {
        onSuccess: (data) => {
          const interval = Math.floor(data.access_exp - Date.now() - 10000);
          setUser({
            initials: data.initials,
            username: data.username,
            email: data.email,
            full_name: data.full_name,
            access: data.access,
            access_exp: data.access_exp,
            refresh_exp: data.refresh_exp,
            interval: interval,
          });
          localStorage.setItem("refresh", data.refresh_exp);
          router.push(`/${data.username}`);
        },
        onError: (error) => {
          setApiErrors(error.response.data);
          localStorage.removeItem("refresh");
        },
      });
    })();
  }, [uid, token]);

  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Activate Account - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Activate account - Trackedfitness" />
      </Head>

      <h1 className="text-2xl font-bold">Activate Account</h1>

      <FormAPIError status={apiErrors?.non_field_errors} />

      {apiErrors ? (
        <>
          <div className="space-y-4">
            <p>
              There has been a problem activating your account. Click the link
              below to request a new activation token.
            </p>
            <div>
              <Link
                href="/settings/resend-activation-email"
                className="text-blue-500 hover:underline"
              >
                Retry
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          <div>
            <Link
              href="/profile/setup"
              className="text-blue-500 hover:underline"
            >
              Set up Profile
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Activate;
