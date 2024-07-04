import DateNav from "@/components/DateNav";
import { API } from "@/utils/constants";
import { formatISO } from "date-fns";
import { cookies } from "next/headers";
import DietTargetDateList from "./DietTargetDateList";

async function getDietTargetDateList({
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
  const res = await fetch(`${API}/diet-targets-month/${username}/${date}/`, {
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

export default async function DietTargetsDateListPage({
  params: {
    username,
    date = formatISO(new Date(), { representation: "date" }),
  },
}: {
  params: { username: string; date?: string };
}) {
  const dietTargetDateList = await getDietTargetDateList({ username, date });

  return (
    <div>
      <div className="mt-4">
        <DateNav
          username={username}
          date={date}
          segment="diet-targets-date"
          modifier="month"
        />
      </div>
      <h2 className="my-4 text-xl font-bold">Diet Targets</h2>

      <div className="grid grid-cols-[auto_repeat(17,_minmax(0,_1fr))] border-l-[1px] border-t-[1px]">
        <DietTargetDateList
          username={username}
          date={date}
          dietTargetDateList={dietTargetDateList}
        />
      </div>
    </div>
  );
}
