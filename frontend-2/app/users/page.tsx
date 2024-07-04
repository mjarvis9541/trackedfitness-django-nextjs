import { API } from "@/utils/constants";
import { Metadata } from "next";
import { cookies } from "next/headers";
import UserListItem from "./UserListItem";

async function getUsers({
  page = "1",
  search = "",
  ordering = "name",
}: {
  page?: string;
  search?: string;
  ordering?: string;
}) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(
    `${API}/users/?page=${page}&search=${search}&ordering=${ordering}`,
    { headers }
  );
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export const metadata: Metadata = {
  title: "Users - Trackedfitness",
  description: "Trackedfitness user list page",
};

export default async function UserListPage() {
  const users = await getUsers({});
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Users</h1>
      <div className="grid grid-cols-[4fr_repeat(4,_minmax(0,_1fr))] border-l-[1px] border-t-[1px]">
        <div className="border-r-[1px] border-b-[1px] p-2 font-bold">
          Username
        </div>
        <div className="border-r-[1px] border-b-[1px] p-2 font-bold">
          Followers
        </div>
        <div className="border-r-[1px] border-b-[1px] p-2 font-bold">
          Following
        </div>
        <div className="border-r-[1px] border-b-[1px] p-2 font-bold">
          Last Login
        </div>
        <div className="border-r-[1px] border-b-[1px] p-2 font-bold">
          Date Joined
        </div>
        {users.results.map((user: User) => (
          <UserListItem key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
