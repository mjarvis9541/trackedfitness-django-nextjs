"use client";

import { formatDay, formatShortDate } from "@/utils/format-date";
import { formatISO } from "date-fns";
import Link from "next/link";

export default function ProgressListItem({
  username,
  progress,
  isChecked,
  handleCheck,
}: {
  username: string;
  progress: Progress;
  isChecked: string[];
  handleCheck: (e: any) => void;
}) {
  const now = formatISO(new Date(), { representation: "date" });
  const dateNow = ``;
  const dateNotNow = ``;
  return (
    <div className="group contents">
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        <input
          type="checkbox"
          value={progress.date}
          checked={isChecked.includes(progress.date)}
          onChange={handleCheck}
        />
      </div>
      <Link
        href={{
          pathname: progress.id
            ? `${username}/progress/${progress.date}/${progress.id}`
            : `${username}/progress/create`,
          query: progress.id ? {} : { date: progress.date },
        }}
        className={
          progress.date === now
            ? `flex items-center justify-end border-b-[1px] border-r-[1px] bg-blue-400 p-1.5 group-hover:bg-amber-200`
            : `flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200`
        }
      >
        {formatShortDate(progress.date)}
      </Link>
      <div
        className={
          progress.date === now
            ? `flex items-center justify-end border-b-[1px] border-r-[1px] bg-blue-400 p-1.5 group-hover:bg-amber-200`
            : `flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200`
        }
      >
        {formatDay(progress.date)}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {progress.energy_burnt}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {progress.week_avg_energy_burnt &&
          Number(progress.week_avg_energy_burnt).toFixed(0)}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {progress.weight}
      </div>
      <div className="flex items-center justify-end border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200">
        {progress.week_avg_weight?.toFixed(2)}
      </div>
      <Link
        href={{
          pathname: progress.id
            ? `/${username}/progress/${progress.date}/${progress.id}/edit`
            : `/${username}/progress/create`,
          query: progress.id ? {} : { date: progress.date },
        }}
        className="flex items-center justify-start truncate border-b-[1px] border-r-[1px] p-1.5 group-hover:bg-amber-200"
      >
        {progress.notes}
      </Link>
    </div>
  );
}
