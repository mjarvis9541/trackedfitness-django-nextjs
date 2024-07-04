import { formatISO } from "date-fns";
import Link from "next/link";
import { formatDay, formatShortDate } from "../../utils/format-date";

export default function ProgressListItem({
  username,
  data,
  isCheck,
  handleCheck,
}) {
  const now = formatISO(new Date(), { representation: "date" });
  return (
    <>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-2">
        <input
          type="checkbox"
          id={data.date}
          value={data.date}
          checked={isCheck.includes(data.date)}
          onChange={handleCheck}
        />
      </div>
      <Link
        href={`/${username}/progress-month/${data.date}/update`}
        className="flex items-center justify-end border-b-[1px] border-r-[1px] p-2 hover:bg-gray-100"
      >
        {formatShortDate(data.date)}
      </Link>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-2">
        {formatDay(data.date)}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-2">
        {data.energy_burnt}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-2">
        {data.week_avg_energy_burnt &&
          Number(data.week_avg_energy_burnt).toFixed(0)}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-2">
        {data.weight}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-2">
        {data.week_avg_weight}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-2">
        {data.notes}
      </div>
      {/* <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-2 text-xs">
        {data.updated_at && formatDateTime(data.updated_at)}
      </div> */}
    </>
  );
}
