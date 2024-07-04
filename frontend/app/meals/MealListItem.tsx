"use client";

import Link from "next/link";

export default function MealListItem({ data }) {
  return (
    <>
      <Link
        href={`/meals/${data.id}`}
        className="col-span-4 flex items-center justify-start bg-gray-100 p-2 font-bold hover:bg-gray-100 md:col-span-1 md:border-b-[1px] md:bg-white md:font-normal"
      >
        {data.name}
      </Link>

      <Link
        href={`/meals/${data.id}/add-food`}
        className="hidden items-center justify-end bg-gray-100 p-2 font-bold hover:bg-gray-100 md:flex md:border-b-[1px] md:bg-white md:font-normal"
      >
        {data.food_count}
      </Link>

      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Calories
      </div>
      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Protein
      </div>
      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Carbs
      </div>
      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Fat
      </div>

      <div className="flex items-center justify-end border-b-[1px] p-2">
        {data.energy || 0} kcal
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {data.protein || 0} g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {data.carbohydrate || 0} g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {data.fat || 0} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.saturates || 0} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.sugars || 0} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.fibre || 0} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.salt || 0} g
      </div>
      <Link
        href={`/${data.created_by_username}`}
        className="hidden items-center justify-end border-b-[1px] p-2 hover:bg-gray-100 md:flex"
      >
        {data.created_by_username}
      </Link>
    </>
  );
}
