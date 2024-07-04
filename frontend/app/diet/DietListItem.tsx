"use client";

import Link from "next/link";

export default function DietListItem({
  username,
  date,
  data,
  meal,
  isCheck,
  handleCheck,
}: {
  username: string;
  date: string;
}) {
  return (
    <>
      <div className="hidden items-center justify-center border-b-[1px] md:flex">
        <input
          type="checkbox"
          id={data.id}
          checked={isCheck.includes(JSON.stringify(data.id))}
          onChange={handleCheck}
        />
      </div>
      <Link
        href={`/${username}/diet/${date}/${meal.order}/${data.id}`}
        className="col-span-3 flex items-center justify-start border-b-[1px] p-2 font-bold hover:bg-gray-100 md:col-span-1 md:font-normal"
      >
        {data.food_name}, {data.brand_name}
      </Link>
      <Link
        href={`/${username}/diet/${date}/${meal.order}/${data.id}/update`}
        className="flex items-center justify-end border-b-[1px] p-2 hover:bg-gray-100"
      >
        {data.data_value}
        {data.data_measurement}
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
        {data.energy.toFixed(0)}kcal
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {data.protein.toFixed(1)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {data.carbohydrate.toFixed(1)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {data.fat.toFixed(1)}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.saturates.toFixed(1)}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.sugars.toFixed(1)}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.fibre.toFixed(1)}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.salt.toFixed(2)}g
      </div>
    </>
  );
}
