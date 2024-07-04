import { formatISO } from "date-fns";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ProfileDetail from "../../app/profiles/ProfileDetail";
import useGetProfile from "../../app/profiles/useGetProfile";
import TargetDetail from "../../app/targets/TargetDetail";
import useGetTargetByUsername from "../../app/targets/useGetTargetByUsername";
import UserNavbar from "../../components/UserNav";

export default function UserProfile() {
  const router = useRouter();
  const { username, date = formatISO(new Date(), { representation: "date" }) } =
    router.query;
  const {
    isLoading: profileIsLoading,
    error: profileError,
    data: profile,
  } = useGetProfile();

  const {
    isLoading: targetIsLoading,
    error: targetError,
    data: target,
  } = useGetTargetByUsername({ username });

  return (
    <div className="p-4">
      <Head>
        <title>{username} - Trackedfitness</title>
        <meta name="description" content="Log and track daily food intake" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mb-4">
        <UserNavbar username={username} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <ProfileDetail profile={profile} />
        </div>

        <div className="col-span-4">
          <TargetDetail target={target} />
        </div>

        <div className="col-span-4">
          {" "}
          <ul className="space-y-4">
            <li>
              <Link
                className="text-blue-500 hover:underline"
                href="/settings/change-username"
              >
                Change Username
              </Link>
            </li>
            <li>
              <Link
                className="text-blue-500 hover:underline"
                href="/settings/change-email"
              >
                Change Email
              </Link>
            </li>
            <li>
              <Link
                className="text-blue-500 hover:underline"
                href="/settings/change-password"
              >
                Change Password
              </Link>
            </li>
            <li>
              <Link
                className="text-blue-500 hover:underline"
                href="/settings/password-reset"
              >
                Reset Password
              </Link>
            </li>
            <li>
              <Link className="text-blue-500 hover:underline" href="/logout">
                Log out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
