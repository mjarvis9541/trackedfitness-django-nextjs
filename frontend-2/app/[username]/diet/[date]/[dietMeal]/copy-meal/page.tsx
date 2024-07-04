import DietListItem from "@/app/[username]/diet/DietListItem";
import DietCopyPreviousForm from "@/app/[username]/diet/[date]/[dietMeal]/copy-meal/DietCopyPreviousForm";
import { formatLongDate } from "@/utils/format-date";
import { formatISO, subDays } from "date-fns";
import { cookies } from "next/headers";
import { getDietList } from "../../../page";

export default async function DietCopyPreviousPage({
  params: { username, date, dietMeal },
}: {
  params: { username: string; date: string; dietMeal: string };
}) {
  const previous = formatISO(subDays(new Date(date), 1), {
    representation: "date",
  });

  const dietDayList = await getDietList({
    username,
    date: previous,
  });
  const token = cookies().get("accessToken")?.value;

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Copy Meal</h1>
        <p className="text-2xl font-bold">
          Meal {dietMeal}, {formatLongDate(date)}
        </p>
      </div>

      <h3 className="text-xl font-bold">From {formatLongDate(previous)}</h3>

      <div className="grid grid-cols-4 md:grid-cols-[3fr_repeat(9,_minmax(0,_1fr))]">
        <div className="col-span-3 items-center justify-start border-b-[1px] p-2 font-bold md:col-span-1 md:flex">
          Meal {dietMeal}
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
          Quantity
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
          Calories
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
          Protein
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
          Carbs
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
          Fat
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
          Saturates
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
          Sugars
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
          Fibre
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
          Salt
        </div>
        {dietDayList.map((diet: DietDay) => (
          <DietListItem key={diet.id} diet={diet} showCheckbox={false} />
        ))}
        <div className="col-span-4 p-2 font-bold md:col-span-2">Total</div>
        <div className="flex items-center justify-end p-2 font-bold md:flex">
          {dietDayList[0]?.total_day_energy.toFixed() || 0}kcal
        </div>
        <div className="flex items-center justify-end p-2 font-bold md:flex">
          {dietDayList[0]?.total_day_protein.toFixed(1) || 0}g
        </div>
        <div className="flex items-center justify-end p-2 font-bold md:flex">
          {dietDayList[0]?.total_day_carbohydrate.toFixed(1) || 0}g
        </div>
        <div className="flex items-center justify-end p-2 font-bold md:flex">
          {dietDayList[0]?.total_day_fat.toFixed(1) || 0}g
        </div>
        <div className="hidden items-center justify-end p-2 font-bold md:flex">
          {dietDayList[0]?.total_day_saturates.toFixed(1) || 0}g
        </div>
        <div className="hidden items-center justify-end p-2 font-bold md:flex">
          {dietDayList[0]?.total_day_sugars.toFixed(1) || 0}g
        </div>
        <div className="hidden items-center justify-end p-2 font-bold md:flex">
          {dietDayList[0]?.total_day_fibre.toFixed(1) || 0}g
        </div>
        <div className="hidden items-center justify-end p-2 font-bold md:flex">
          {dietDayList[0]?.total_day_salt.toFixed(2) || 0}g
        </div>
      </div>

      <DietCopyPreviousForm
        dietDayList={dietDayList}
        username={username}
        fromDate={previous}
        toDate={date}
        fromMeal={dietMeal}
        toMeal={dietMeal}
        token={token}
      />
    </div>
  );
}
