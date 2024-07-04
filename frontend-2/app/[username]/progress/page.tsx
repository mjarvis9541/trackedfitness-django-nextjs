pageimport DateNav from "@/components/DateNav";
import { API } from "@/utils/constants";
import { formatISO } from "date-fns";
import { cookies } from "next/headers";
import ProgressList from "./ProgressList";

export async function getProgressList({
  username,
  date,
}: {
  username: string;
  date: string;
}) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/progress-month/${username}/${date}/`, {
    headers,
  });
  if (!res.ok) {
    throw {
      message: `Request failed with status code ${res.status}`,
      response: {
        data: res.status < 404 && (await res.json()),
        status: res.status,
        statusText: res.statusText,
      },
    };
  }
  return res.json();
}

export default async function ProgressListPage({
  params: {
    username,
    date = formatISO(new Date(), { representation: "date" }),
  },
}: {
  params: { username: string; date?: string };
}) {
  const progressList = await getProgressList({ username, date });

  return (
    <div>
      <div className="mt-4">
        <DateNav
          username={username}
          date={date}
          segment="progress"
          modifier="month"
        />
      </div>
      <h2 className="my-4 text-xl font-bold">Progress</h2>

      <ProgressList
        username={username}
        date={date}
        progressList={progressList}
      />
    </div>
  );
}
