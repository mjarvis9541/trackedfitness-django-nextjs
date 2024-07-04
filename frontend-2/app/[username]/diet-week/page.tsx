import DateNav from "@/components/DateNav";
import { API } from "@/utils/constants";
import { format, formatISO } from "date-fns";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import DietTargetDateWeekList from "./DietTargetDateWeekList";
import DietWeekList from "./DietWeekList";

export async function getDietWeekList({
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
  const res = await fetch(`${API}/diet-week/${username}/${date}/`, { headers });
  if (res.status === 404) {
    notFound();
  }
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

export async function getDietTargetDateWeekList({
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
  const res = await fetch(`${API}/diet-targets-week/${username}/${date}/`, {
    headers,
  });
  if (res.status === 404) {
    notFound();
  }
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

export default async function DietWeekListPage({
  params: {
    username,
    date = formatISO(new Date(), { representation: "date" }),
  },
}: {
  params: { username: string; date?: string };
}) {
  const dietWeekListData = getDietWeekList({ username, date });
  const dietTargetDateWeekListData = getDietTargetDateWeekList({
    username,
    date,
  });
  const [dietWeekList, dietTargetDateWeekList] = await Promise.all([
    dietWeekListData,
    dietTargetDateWeekListData,
  ]);

  return (
    <div className="p-2 md:p-4">
      <div className="mt-4">
        <DateNav
          username={username}
          date={date}
          modifier="week"
          segment="diet-week"
        />
      </div>
      <h2 className="my-4 text-xl font-bold">
        Diet Week {format(new Date(date), "I")}
      </h2>

      <div className="my-4">
        <DietWeekList
          date={date}
          dietWeekList={dietWeekList}
          username={username}
        />
      </div>
      <div>
        <DietTargetDateWeekList
          date={date}
          dietTargetDateWeekList={dietTargetDateWeekList}
          username={username}
        />
      </div>
    </div>
  );
}
