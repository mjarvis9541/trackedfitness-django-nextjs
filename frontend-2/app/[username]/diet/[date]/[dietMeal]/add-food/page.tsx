import { Food, getFoodList } from "@/app/food/page";
import DietAddFoodListItem from "@/app/[username]/diet/DietAddFoodListItem";
import DietMealNav from "@/app/[username]/diet/DietMealNav";
import DietWeekDayNav from "@/app/[username]/diet/DietWeekDayNav";
import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { foodSortOptions } from "@/utils/constants";
import { formatLongDate } from "@/utils/format-date";
import { cookies } from "next/headers";

export default async function DietAddFoodPage({
  params: { username, date, dietMeal },
  searchParams: { page = "1", search = "", brand = "", ordering = "" },
}: {
  params: { username: string; date: string; dietMeal: string };
  searchParams: {
    page: string;
    search: string;
    brand: string;
    ordering: string;
  };
}) {
  const food = await getFoodList({ page, search, brand, ordering });
  const token = cookies().get("accessToken")?.value;

  return (
    <div className="space-y-4">
      <div>
        <DietWeekDayNav
          username={username}
          date={date}
          meal={dietMeal}
          path="add-food"
        />
      </div>
      <DietMealNav username={username} date={date} path="add-food" />

      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Add Food</h1>
        <p className="text-2xl font-bold">
          Meal {dietMeal}, {formatLongDate(date)}
        </p>
      </div>

      <div className="flex flex-row-reverse">
        <div className="flex gap-4">
          <Search
            id="search"
            path={`${username}/diet/${date}/${dietMeal}/add-food`}
          />
          <Filter
            id="ordering"
            label="Sort by"
            path={`${username}/diet/${date}/${dietMeal}/add-food`}
            filter="ordering"
            defaultDisplay="Name (A-z)"
            defaultValue="name"
            options={foodSortOptions}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-[2fr_repeat(12,_minmax(0,_1fr))]">
        <div className="col-span-3 hidden items-center justify-start border-b-[1px] p-2 font-bold md:flex">
          Food
        </div>
        <div className="hidden items-center justify-start border-b-[1px] p-2 font-bold md:flex">
          Quantity
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
        <div className="hidden border-b-[1px] md:flex"></div>
        {food.results.map((food: Food) => (
          <DietAddFoodListItem
            key={food.id}
            date={date}
            token={token}
            meal={dietMeal}
            food={food}
            username={username}
          />
        ))}
      </div>
      <Pagination
        path={`${username}/diet/${date}/${dietMeal}/add-food`}
        page={page}
        data={food}
      />
    </div>
  );
}
