import { getMealList, Meal } from "@/app/meals/page";
import DietAddMealListItem from "@/app/[username]/diet/DietAddMealListItem";
import DietMealNav from "@/app/[username]/diet/DietMealNav";
import DietWeekDayNav from "@/app/[username]/diet/DietWeekDayNav";
import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { mealSortOptions } from "@/utils/constants";
import { formatLongDate } from "@/utils/format-date";
import { cookies } from "next/headers";

export default async function DietAddMealPage({
  params: { username, date, dietMeal },
  searchParams: { page = "1", search = "", ordering = "" },
}: {
  params: { username: string; date: string; dietMeal: string };
  searchParams: {
    page?: string;
    search?: string;
    ordering?: string;
  };
}) {
  const mealList = await getMealList({ page, search, ordering });
  const token = cookies().get("accessToken")?.value;
  return (
    <div className="space-y-4">
      <div>
        <DietWeekDayNav
          username={username}
          date={date}
          meal={dietMeal}
          path="add-meal"
        />
      </div>
      <DietMealNav username={username} date={date} path="add-meal" />
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Add Meal</h1>
        <p className="text-2xl font-bold">
          Meal {dietMeal}, {formatLongDate(date)}
        </p>
      </div>

      <div className="flex flex-row-reverse">
        <div className="flex gap-4">
          <Search
            id="search"
            path={`${username}/diet/${date}/${dietMeal}/add-meal`}
          />
          <Filter
            id="ordering"
            label="Sort by"
            path={`${username}/diet/${date}/${dietMeal}/add-meal`}
            filter="ordering"
            defaultDisplay="Name (A-z)"
            defaultValue="name"
            options={mealSortOptions}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-[3fr_repeat(11,_minmax(0,_1fr))]">
        <div className="hidden items-center justify-start border-b-[1px] p-2 font-bold md:col-span-2 md:flex">
          Meal
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
          Food
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
          Calories
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
          Protein
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
          Carbs
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
          Fat
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
          Saturates
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
          Sugars
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
          Fibre
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
          Salt
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex"></div>
        {mealList.results.map((meal: Meal) => (
          <DietAddMealListItem
            key={meal.id}
            date={date}
            token={token}
            meal={meal}
            dietMeal={dietMeal}
            username={username}
          />
        ))}
      </div>
      <Pagination
        path={`${username}/diet/${date}/${dietMeal}/add-meal`}
        page={page}
        data={mealList}
      />
    </div>
  );
}
