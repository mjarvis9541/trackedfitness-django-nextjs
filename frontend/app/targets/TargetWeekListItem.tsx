import { formatISO } from "date-fns";
import Link from "next/link";
import {
  formatDateTime,
  formatDay,
  formatShortDate,
} from "../../utils/format-date";

export default function TargetWeekListItem({
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
        href={`/${username}/target-month/${data.date}/update`}
        className="flex items-center justify-end border-b-[1px] p-2 hover:bg-gray-100"
      >
        {formatShortDate(data.date)}
      </Link>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {formatDay(data.date)}
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {data.energy} kcal
      </div>
      <div className="flex items-center justify-end gap-1 border-b-[1px] p-2">
        {Number(data.protein).toFixed(0)}g{" "}
        <span className="text-sm font-normal text-gray-400">
          ({data.percent_protein.toFixed(0)}%)
        </span>
      </div>
      <div className="flex items-center justify-end gap-1 border-b-[1px] p-2">
        {Number(data.carbohydrate).toFixed(0)}g{" "}
        <span className="text-sm font-normal text-gray-400">
          ({Number(data.percent_carbohydrate).toFixed(0)}%)
        </span>
      </div>
      <div className="flex items-center justify-end gap-1 border-b-[1px] p-2">
        {Number(data.fat).toFixed(0)}g{" "}
        <span className="text-sm font-normal text-gray-400">
          ({data.percent_fat.toFixed(0)}%)
        </span>
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.saturates).toFixed(0)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.sugars).toFixed(0)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.fibre).toFixed(0)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.salt).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.energy_per_kg).toFixed(0)} kcal
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.protein_per_kg).toFixed(2)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.carbohydrate_per_kg).toFixed(2)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {Number(data.fat_per_kg).toFixed(2)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2 text-end text-xs">
        {data.updated_at && formatDateTime(data.updated_at)}
      </div>
    </>
  );
}
