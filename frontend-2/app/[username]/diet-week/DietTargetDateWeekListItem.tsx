import { formatDay, formatShortDate } from "@/utils/format-date";
import Link from "next/link";
import { DietTargetWeek } from "./page";

export default function DietTargetDateWeekListItem({
  dietTargetDateWeek,
}: {
  dietTargetDateWeek: DietTargetWeek;
}) {
  return (
    <div className="group contents">
      <div className="p-2 group-hover:bg-amber-200">
        <input type="checkbox" />
      </div>
      <div className="p-2 group-hover:bg-amber-200">
        <Link
          href={{
            pathname: dietTargetDateWeek.id
              ? `/diet-targets-date/${dietTargetDateWeek.id}`
              : `/diet-targets-date/create`,
            query: dietTargetDateWeek.id
              ? {}
              : { date: dietTargetDateWeek.date },
          }}
          className="text-blue-500 hover:underline"
        >
          {formatShortDate(dietTargetDateWeek.date)}
        </Link>
      </div>
      <div className="p-2 group-hover:bg-amber-200">
        {formatDay(dietTargetDateWeek.date)}
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietTargetDateWeek.energy).toFixed(0)}kcal
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietTargetDateWeek.protein).toFixed(0)}g
        <span className="ml-1 text-xs text-gray-400">
          ({Number(dietTargetDateWeek.percent_protein).toFixed(0)}%)
        </span>
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietTargetDateWeek.carbohydrate).toFixed(0)}g
        <span className="ml-1 text-xs text-gray-400">
          ({Number(dietTargetDateWeek.percent_carbohydrate).toFixed(0)}%)
        </span>
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietTargetDateWeek.fat).toFixed(0)}g
        <span className="ml-1 text-xs text-gray-400">
          ({Number(dietTargetDateWeek.percent_fat).toFixed(0)}%)
        </span>
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietTargetDateWeek.saturates).toFixed(0)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietTargetDateWeek.sugars).toFixed(0)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietTargetDateWeek.fibre).toFixed(0)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietTargetDateWeek.salt).toFixed(1)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietTargetDateWeek.energy_per_kg).toFixed(0)}kcal
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietTargetDateWeek.protein_per_kg).toFixed(1)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietTargetDateWeek.carbohydrate_per_kg).toFixed(1)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietTargetDateWeek.fat_per_kg).toFixed(1)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietTargetDateWeek.updated_at
          ? formatShortDate(dietTargetDateWeek.updated_at)
          : "-"}
      </div>
      {/* <span className="mr-2 text-sm">
          ({Number(dietTargetDateWeek.protein_pct)}%)
        </span>
        <span className="mr-2 text-sm">
          ({Number(dietTargetDateWeek.protein_per_kg)}g)
        </span> */}
    </div>
  );
}
