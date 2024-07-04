import { formatISO } from "date-fns";
import Link from "next/link";
import {
  formatDateTime,
  formatDay,
  formatShortDate,
} from "../../utils/format-date";

export default function DietWeekListItem({
  data,
  username,
  isCheck,
  handleCheck,
}: {
  data: any;
  username: string;
  isCheck: string[];
  handleCheck: () => void;
}) {
  const now = formatISO(new Date(), { representation: "date" });

  return (
    <>
      <div className="border-b-[1px] p-2">
        <input
          type="checkbox"
          id={data.date}
          value={data.date}
          checked={isCheck.includes(data.date)}
          onChange={handleCheck}
        />
      </div>
      <Link
        href={`/${username}/diet/${data.date}`}
        className="flex items-center justify-end border-b-[1px] p-2 hover:bg-gray-100"
      >
        {formatShortDate(data.date)}
      </Link>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {formatDay(data.date)}
      </div>

      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.total_day_energy || 0).toFixed(0)}kcal
      </div>
      <div className="flex items-center justify-end gap-1 border-b-[1px] p-2">
        {Number(data.total_day_protein || 0).toFixed(0)}g{" "}
        <span className="text-sm text-gray-400">
          ({Number(data.total_day_protein_pct || 0).toFixed(0)}%)
        </span>
      </div>
      <div className="flex items-center justify-end gap-1 border-b-[1px] p-2">
        {Number(data.total_day_carbohydrate || 0).toFixed(0)}g{" "}
        <span className="text-sm text-gray-400">
          ({Number(data.total_day_carbohydrate_pct || 0).toFixed(0)}%)
        </span>
      </div>
      <div className="flex items-center justify-end gap-1 border-b-[1px] p-2">
        {Number(data.total_day_fat || 0).toFixed(0)}g{" "}
        <span className="text-sm text-gray-400">
          ({Number(data.total_day_fat_pct || 0).toFixed(0)}%)
        </span>
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.total_day_saturates || 0).toFixed(0)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.total_day_sugars || 0).toFixed(0)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.total_day_fibre || 0).toFixed(0)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.total_day_salt || 0).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.total_day_energy_per_kg || 0).toFixed(0)}kcal
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.total_day_protein_per_kg || 0).toFixed(2)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.total_day_carbohydrate_per_kg || 0).toFixed(2)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.total_day_fat_per_kg || 0).toFixed(2)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 text-end text-xs">
        {data.last_updated_at && formatDateTime(data.last_updated_at)}
      </div>
    </>
  );
}
