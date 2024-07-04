import { formatLongDate } from "@/utils/format-date";
import { cookies } from "next/headers";
import Link from "next/link";
import UserFollowForm from "./UserFollowForm";
import UserUnfollowForm from "./UserUnfollowForm";

export default function UserNav({ user }: { user: User }) {
  const username = cookies().get("username")?.value;
  const token = cookies().get("accessToken")?.value;
  return (
    <nav className="border p-2">
      <div className="flex justify-between">
        <Link
          href={`/${user.username}`}
          className="text-2xl font-bold capitalize text-blue-500 hover:underline"
        >
          {user.username}
        </Link>
        <div className="flex gap-4">
          {user.username !== username && (
            <>
              {user.is_followed ? (
                <UserUnfollowForm token={token} userId={user.id} />
              ) : (
                <UserFollowForm token={token} userId={user.id} />
              )}
            </>
          )}
          <div className="rounded bg-teal-500 py-2 px-4 hover:bg-teal-400">
            <Link href={`/${user.username}/followers`}>
              Followers {user.follower_count}
            </Link>
          </div>
          <div className="rounded bg-teal-500 py-2 px-4 hover:bg-teal-400">
            <Link href={`/${user.username}/following`}>
              Following {user.following_count}
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-2 flex justify-between">
        <div className="flex gap-4">
          <Link
            href={`/${user.username}/diet`}
            className="text-blue-500 hover:underline"
          >
            Diet
          </Link>
          <Link
            href={`/${user.username}/diet-week`}
            className="text-blue-500 hover:underline"
          >
            Diet Week
          </Link>
          <Link
            href={`/${user.username}/diet-targets-date`}
            className="text-blue-500 hover:underline"
          >
            Diet Targets
          </Link>
          <Link
            href={`/${user.username}/progress`}
            className="text-blue-500 hover:underline"
          >
            Progress
          </Link>
        </div>
        <div className="flex gap-4">
          <div className="my-1 text-sm text-slate-600">
            Last login:{" "}
            {user.last_login ? formatLongDate(user.last_login) : "N/A"}
          </div>
          <div className="my-1 text-sm text-slate-600">
            Member since: {formatLongDate(user.date_joined)}
          </div>
        </div>
      </div>
    </nav>
  );
}
