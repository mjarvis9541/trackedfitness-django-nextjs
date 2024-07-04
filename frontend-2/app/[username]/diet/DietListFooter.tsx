import Link from "next/link";
import { BiCalendarPlus, BiCalendarStar, BiCopyAlt } from "react-icons/bi";

export default function DietListFooter({
  usernameParam,
  dateParam,
  dietList,
  mealNumber,
}: {
  usernameParam: string;
  dateParam: string;
  mealNumber: number;
  dietList: DietDay[];
}) {
  const dietMealTotal = dietList?.find((diet) => diet.meal === mealNumber);
  return (
    <>
      <div className="col-span-4 flex items-center gap-2 py-2 md:col-span-3">
        <Link
          href={`/${usernameParam}/diet/${dateParam}/${mealNumber}/add-food`}
          className="flex items-center justify-center  gap-2 rounded bg-zinc-700 py-1.5 px-3"
        >
          <BiCalendarPlus size={20} /> Food
        </Link>
        <Link
          href={`/${usernameParam}/diet/${dateParam}/${mealNumber}/add-meal`}
          className="flex items-center justify-center  gap-2 rounded bg-zinc-700 py-1.5 px-3"
        >
          <BiCalendarStar size={20} /> Meal
        </Link>
        <Link
          href={`/${usernameParam}/diet/${dateParam}/${mealNumber}/copy-meal`}
          className="flex items-center justify-center  gap-2 rounded bg-zinc-700 py-1.5 px-3"
        >
          <BiCopyAlt size={20} /> Copy
        </Link>
      </div>
      <div className="flex items-center justify-end p-2 font-bold">
        {dietMealTotal?.total_meal_energy.toFixed(0) || "0"}kcal
      </div>
      <div className="flex items-center justify-end p-2 font-bold">
        {dietMealTotal?.total_meal_protein.toFixed(1) || "0"}g
      </div>
      <div className="flex items-center justify-end p-2 font-bold">
        {dietMealTotal?.total_meal_carbohydrate.toFixed(1) || "0"}g
      </div>
      <div className="flex items-center justify-end p-2 font-bold">
        {dietMealTotal?.total_meal_fat.toFixed(1) || "0"}g
      </div>

      <div className="hidden items-center justify-end p-2 font-bold md:flex">
        {dietMealTotal?.total_meal_saturates.toFixed(1) || "0"}g
      </div>
      <div className="hidden items-center justify-end p-2 font-bold md:flex">
        {dietMealTotal?.total_meal_sugars.toFixed(1) || "0"}g
      </div>
      <div className="hidden items-center justify-end p-2 font-bold md:flex">
        {dietMealTotal?.total_meal_fibre.toFixed(1) || "0"}g
      </div>
      <div className="hidden items-center justify-end p-2 font-bold md:flex">
        {dietMealTotal?.total_meal_salt.toFixed(2) || "0"}g
      </div>
    </>
  );
}
