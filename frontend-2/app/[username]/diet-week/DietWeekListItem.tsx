import { formatDay, formatShortDate } from "@/utils/format-date";
import Link from "next/link";

export default function DietWeekListItem({ dietWeek }: { dietWeek: DietWeek }) {
  return (
    <div className="group contents">
      <div className="border-b-[1px] p-2 group-hover:bg-amber-200">
        <input type="checkbox" />
      </div>
      <div className="border-b-[1px] p-2 group-hover:bg-amber-200">
        <Link
          href={`/${dietWeek.username}/diet/${dietWeek.date}`}
          className="text-blue-500 hover:underline"
        >
          {formatShortDate(dietWeek.date)}
        </Link>
      </div>
      <div className="border-b-[1px] p-2 group-hover:bg-amber-200">
        {formatDay(dietWeek.date)}
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietWeek.total_day_energy.toFixed(0)}kcal
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietWeek.total_day_protein.toFixed(0)}g
        <span className="ml-1 text-xs text-gray-400">
          ({dietWeek.total_day_protein_pct.toFixed(0)}%)
        </span>
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietWeek.total_day_carbohydrate.toFixed(0)}g
        <span className="ml-1 text-xs text-gray-400">
          ({dietWeek.total_day_carbohydrate_pct.toFixed(0)}%)
        </span>
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietWeek.total_day_fat.toFixed(0)}g
        <span className="ml-1 text-xs text-gray-400">
          ({dietWeek.total_day_fat_pct.toFixed(0)}%)
        </span>
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietWeek.total_day_saturates.toFixed(0)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietWeek.total_day_sugars.toFixed(0)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietWeek.total_day_fibre.toFixed(0)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietWeek.total_day_salt.toFixed(1)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietWeek.total_day_energy_per_kg).toFixed(0)}kcal
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietWeek.total_day_protein_per_kg).toFixed(1)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietWeek.total_day_carbohydrate_per_kg).toFixed(1)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {Number(dietWeek.total_day_fat_per_kg).toFixed(1)}g
      </div>
      <div className="p-2 text-end group-hover:bg-amber-200">
        {dietWeek.last_updated_at
          ? formatShortDate(dietWeek.last_updated_at)
          : "-"}
      </div>
      {/* <span className="mr-2 text-sm">
          ({dietWeek.total_day_protein_pct}%)
        </span>
        <span className="mr-2 text-sm">
          ({dietWeek.total_day_protein_per_kg}g)
        </span> */}
    </div>
  );
}
