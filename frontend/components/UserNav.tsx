"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useAccess } from "../contexts/UserContext";
import { API } from "../utils/constants";
import { formatLongDateStr } from "../utils/format-date";

type Props = {
  username: string;
};

async function getProfileHeader({ username, access }) {
  const res = await fetch(`${API}/profiles/${username}/profile-header/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
  });
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

const UserNav = ({ username }: Props) => {
  const access = useAccess();
  const { data } = useQuery({
    queryKey: ["profile-header", { username, access }],
    queryFn: () => getProfileHeader({ username, access }),
    enabled: !!username && !!access,
  });

  return (
    <div className="mt-3 flex items-center justify-center gap-6 overflow-auto rounded bg-gray-200 p-3">
      <Link
        href={`/${username}`}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 p-6 text-2xl font-bold text-white"
      >
        {data && data.initials}
      </Link>
      <div className="flex-1">
        <Link
          href={`/${username}`}
          className="flex text-2xl font-bold capitalize"
        >
          {username}
        </Link>
        <div className="flex flex-wrap justify-between">
          <div className="my-1 text-sm text-slate-600">
            Joined: {data && formatLongDateStr(data.date_joined)}
          </div>
          <div className="my-1 text-sm text-slate-600">
            Last login: {data && formatLongDateStr(data.last_login)}
          </div>
        </div>
        <div className="flex justify-between ">
          <div className="flex flex-wrap gap-4 ">
            <Link href={`/${username}/diet`} className="flex hover:underline">
              Diet
            </Link>
            <Link
              href={`/${username}/diet-week`}
              className="flex hover:underline"
            >
              Diet Week
            </Link>
            <Link
              href={`/${username}/diet-month`}
              className="flex hover:underline"
            >
              Diet Month
            </Link>
            <Link
              href={`/${username}/target-month`}
              className="flex hover:underline"
            >
              Targets
            </Link>
            <Link
              href={`/${username}/progress-month`}
              className="flex hover:underline"
            >
              Progress
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNav;
