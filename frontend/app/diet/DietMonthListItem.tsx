import { formatISO } from "date-fns";
import Link from "next/link";
import { formatDay, formatShortDate } from "../../utils/format-date";

export default function DietMonthListItem({
  username,
  data,
  isCheck,
  handleCheck,
}) {
  const now = formatISO(new Date(), { representation: "date" });
  return (
    <>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
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
        className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 hover:bg-gray-100"
      >
        {formatShortDate(data.date)}
      </Link>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {formatDay(data.date)}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {data.total_day_energy}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {data.total_day_protein}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {data.total_day_carbohydrate}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {data.total_day_fat}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {data.total_day_saturates}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {data.total_day_sugars}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {data.total_day_fibre}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {data.total_day_salt}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {data.total_day_energy_per_kg &&
          Number(data.total_day_energy_per_kg).toFixed()}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {data.total_day_protein_per_kg &&
          Number(data.total_day_protein_per_kg).toFixed(2)}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {data.total_day_carbohydrate_per_kg &&
          Number(data.total_day_carbohydrate_per_kg).toFixed(2)}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {data.total_day_fat_per_kg &&
          Number(
            data.total_day_fat_per_kg && data.total_day_fat_per_kg
          ).toFixed(2)}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {data.total_day_protein_pct &&
          Number(data.total_day_protein_pct).toFixed(1)}
        {data.total_day_protein_pct && "%"}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {data.total_day_carbohydrate_pct &&
          Number(data.total_day_carbohydrate_pct).toFixed(1)}
        {data.total_day_carbohydrate_pct && "%"}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5">
        {data.total_day_fat_pct && Number(data.total_day_fat_pct).toFixed(1)}
        {data.total_day_fat_pct && "%"}
      </div>
    </>
  );
}
