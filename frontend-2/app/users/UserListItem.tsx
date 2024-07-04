import { formatDateTime } from "@/utils/format-date";
import Link from "next/link";
import { User } from "./page";

export default function UserListItem({ user }: { user: User }) {
  return (
    <>
      <div className="border-r-[1px] border-b-[1px] p-2">
        <Link href={`/${user.username}`} className="hover:underline">
          {user.username}
        </Link>
      </div>
      <div className="border-r-[1px] border-b-[1px] p-2">
        <Link
          href={`/${user.username}/followers`}
          className="text-blue-500 hover:underline"
        >
          {user.follower_count}
        </Link>
      </div>
      <div className="border-r-[1px] border-b-[1px] p-2">
        <Link
          href={`/${user.username}/following`}
          className="text-blue-500 hover:underline"
        >
          {user.following_count}
        </Link>
      </div>
      <div className="border-r-[1px] border-b-[1px] p-2">
        {user.last_login ? formatDateTime(user.last_login) : "-"}
      </div>
      <div className="border-r-[1px] border-b-[1px] p-2">
        {formatDateTime(user.date_joined)}
      </div>
    </>
  );
}
