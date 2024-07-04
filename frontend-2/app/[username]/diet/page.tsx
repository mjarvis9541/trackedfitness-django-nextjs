import { getDietTarget } from "@/app/diet-targets/page";
import DietDayTarget from "@/app/[username]/diet/DietDayTarget";
import DietDayTotal from "@/app/[username]/diet/DietDayTotal";
import DietList from "@/app/[username]/diet/DietList";
import DateNav from "@/components/DateNav";
import { API, mealList } from "@/utils/constants";
import { formatISO } from "date-fns";
import { cookies } from "next/headers";

export async function getDietList(username: string, date: string) {
  const accessToken = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (accessToken) {
    headers.Authorization = `JWT ${accessToken}`;
  }
  const res = await fetch(`${API}/diet-day/${username}/${date}/`, { headers });
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export default async function DietPage({
  params: {
    username,
    date = formatISO(new Date(), { representation: "date" }),
  },
}: {
  params: { username: string; date?: string };
}) {
  const dietListFn = getDietList(username, date);
  const dietTargetFn = getDietTarget({ username });
  const [dietList, dietTarget] = await Promise.all([dietListFn, dietTargetFn]);

  const token = cookies().get("accessToken")?.value;
  return (
    <div className="p-4">
      {/* <DietWeekDayNav username={username} date={date} /> */}

      <div className="">
        <DateNav
          username={username}
          date={date}
          segment="diet"
          modifier="day"
        />
      </div>

      <h2 className="my-4 text-xl font-bold">Diet</h2>

      <div>
        {mealList.map((meal) => (
          <DietList
            usernameParam={username}
            dateParam={date}
            key={meal.order}
            mealListData={meal}
            dietList={dietList}
            token={token}
          />
        ))}
      </div>

      <DietDayTotal dietDayList={dietList} />
      <DietDayTarget dietTarget={dietTarget} />
    </div>
  );
}
