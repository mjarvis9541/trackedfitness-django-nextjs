import { formatISO } from "date-fns";
import Link from "next/link";
import { formatDay, formatShortDate } from "../../utils/format-date";

export default function TargetMonthListItem({
  username,
  data,
  isCheck,
  handleCheck,
}) {
  const now = formatISO(new Date(), { representation: "date" });
  return (
    <>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        <input
          type="checkbox"
          value={data.date}
          id={data.date}
          checked={isCheck.includes(data.date)}
          onChange={handleCheck}
        />
      </div>
      <Link
        className="border-b-[1px] border-r-[1px] p-2 text-end hover:bg-gray-100"
        href={`/${username}/target-month/${data.date}/update`}
      >
        {formatShortDate(data.date)}
      </Link>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {formatDay(data.date)}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {data.energy}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {data.protein}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {data.carbohydrate}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {data.fat}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {data.saturates}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {data.sugars}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {data.fibre}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {data.salt}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {data.energy_per_kg}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {data.protein_per_kg}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {data.carbohydrate_per_kg}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {data.fat_per_kg}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {data.percent_protein}
        {data.percent_protein && "%"}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {data.percent_carbohydrate}
        {data.percent_carbohydrate && "%"}
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 text-end">
        {data.percent_fat}
        {data.percent_fat && "%"}
      </div>
    </>
  );
}
