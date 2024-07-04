"use client";

import Link from "next/link";

export default function DietListFooter({ data, username, date, meal }) {
  const mealTotal = data?.find((obj) => obj.meal === meal.order);

  return (
    <>
      <div className="col-span-4 flex space-x-4 bg-gray-100 p-2 md:col-span-3 md:border-b-[1px]">
        <Link
          href={`/${username}/diet/${date}/${meal.order}/add-food`}
          className="flex text-blue-600 hover:underline"
        >
          Add Food
        </Link>
        <Link
          href={`/${username}/diet/${date}/${meal.order}/add-meal`}
          className="flex text-blue-600 hover:underline"
        >
          Add Meal
        </Link>
        <Link
          href={`/${username}/diet/${date}/${meal.order}/copy-previous`}
          className="flex text-blue-600 hover:underline"
        >
          Copy Yesterday
        </Link>
      </div>
      <div className="flex items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold">
        {mealTotal?.total_meal_energy.toFixed() || 0} kcal
      </div>
      <div className="flex items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold">
        {mealTotal?.total_meal_protein.toFixed(1) || 0} g
      </div>
      <div className="flex items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold">
        {mealTotal?.total_meal_carbohydrate.toFixed(1) || 0} g
      </div>
      <div className="flex items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold">
        {mealTotal?.total_meal_fat.toFixed(1) || 0} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold md:flex">
        {mealTotal?.total_meal_saturates.toFixed(1) || 0} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold md:flex">
        {mealTotal?.total_meal_sugars.toFixed(1) || 0} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold md:flex">
        {mealTotal?.total_meal_fibre.toFixed(1) || 0} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold md:flex">
        {mealTotal?.total_meal_salt.toFixed(2) || 0} g
      </div>
    </>
  );
}
