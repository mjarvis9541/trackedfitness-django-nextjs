"use client";

import { formatDay, formatShortDate } from "@/utils/format-date";
import { formatISO } from "date-fns";
import Link from "next/link";

export default function DietTargetDateListItem({
  username,
  dietTargetDate,
  isChecked,
  handleCheck,
}: {
  username: string;
  dietTargetDate: DietTargetDate;
  isChecked: string[];
  handleCheck: (e: any) => void;
}) {
  const now = formatISO(new Date(), { representation: "date" });

  return (
    <div className="group contents">
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        <input
          type="checkbox"
          value={dietTargetDate.date}
          checked={isChecked.includes(dietTargetDate.date)}
          onChange={handleCheck}
        />
      </div>
      <Link
        href={{
          pathname: dietTargetDate.id
            ? `/${username}/diet-targets-date/${dietTargetDate.id}`
            : `/${username}/diet-targets-date/create`,
          query: dietTargetDate.id ? {} : { date: dietTargetDate.date },
        }}
        className={
          dietTargetDate.date === now
            ? `bg-blur-400 flex items-center justify-end border-b-[1px] border-r-[1px] bg-blue-400 p-1.5 group-hover:bg-amber-200`
            : `flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200`
        }
      >
        {formatShortDate(dietTargetDate.date)}
      </Link>
      <div
        className={
          dietTargetDate.date === now
            ? `flex items-center justify-end border-b-[1px] border-r-[1px] bg-blue-400 p-1.5 group-hover:bg-amber-200`
            : `flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200`
        }
      >
        {formatDay(dietTargetDate.date)}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {dietTargetDate.energy}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {dietTargetDate.protein}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {dietTargetDate.carbohydrate}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {dietTargetDate.fat}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {dietTargetDate.saturates}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {dietTargetDate.sugars}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {dietTargetDate.fibre}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {dietTargetDate.salt}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {dietTargetDate.energy_per_kg &&
          Number(dietTargetDate.energy_per_kg).toFixed()}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {dietTargetDate.protein_per_kg &&
          Number(dietTargetDate.protein_per_kg).toFixed(2)}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {dietTargetDate.carbohydrate_per_kg &&
          Number(dietTargetDate.carbohydrate_per_kg).toFixed(2)}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {dietTargetDate.fat_per_kg &&
          Number(
            dietTargetDate.fat_per_kg && dietTargetDate.fat_per_kg
          ).toFixed(2)}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {dietTargetDate.percent_protein &&
          Number(dietTargetDate.percent_protein).toFixed(1)}
        {dietTargetDate.percent_protein && "%"}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {dietTargetDate.percent_carbohydrate &&
          Number(dietTargetDate.percent_carbohydrate).toFixed(1)}
        {dietTargetDate.percent_carbohydrate && "%"}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {dietTargetDate.percent_fat &&
          Number(dietTargetDate.percent_fat).toFixed(1)}
        {dietTargetDate.percent_fat && "%"}
      </div>
    </div>
  );
}
