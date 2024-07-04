import { Food, getFoodList } from "@/app/food/page";
import { cookies } from "next/headers";
import MealAddFoodListItem from "../../MealAddFoodListItem";

export default async function MealAddFoodPage({
  params: { mealId },
  searchParams: { page = "1", search = "", brand = "", ordering = "" },
}: {
  params: { mealId: string };
  searchParams: {
    page: string;
    search: string;
    brand: string;
    ordering: string;
  };
}) {
  const foodList = await getFoodList({ page, search, brand, ordering });
  const token: string | undefined = cookies().get("accessToken")?.value;
  return (
    <div>
      <h1 className="text-2xl font-bold">Add Food to Meal</h1>
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
        {foodList.results.map((food: Food) => (
          <MealAddFoodListItem
            key={food.id}
            mealId={mealId}
            food={food}
            token={token}
          />
        ))}
      </div>
    </div>
  );
}
