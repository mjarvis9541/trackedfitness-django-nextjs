"use client";

import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  formatISO,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import Link from "next/link";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { formatShortDateStr } from "../utils/format-date";

export default function DateNav({
  username,
  date,
  segment,
  modifier,
}: {
  username: string;
  date: string;
  segment: string;
  modifier: "day" | "week" | "month" | "year";
}) {
  const now = new Date(date);

  let add;
  let sub;
  switch (modifier) {
    case "day":
      add = addDays;
      sub = subDays;
      break;
    case "week":
      add = addWeeks;
      sub = subWeeks;
      break;
    case "month":
      add = addMonths;
      sub = subMonths;
      break;
    case "year":
      add = addYears;
      sub = subYears;
      break;
  }

  const next = formatISO(add(now, 1), { representation: "date" });
  const previous = formatISO(sub(now, 1), { representation: "date" });

  return (
    <div className="flex items-center justify-between">
      <div className="font-bold">{formatShortDateStr(date)}</div>
      <div className="flex gap-2">
        <Link
          href={`/${username}/${segment}`}
          className="flex items-center justify-center rounded  bg-zinc-700 py-2 px-4  font-bold  hover:bg-zinc-500"
        >
          Today
        </Link>
        <Link
          href={`/${username}/${segment}/${previous}`}
          className="flex items-center justify-center rounded  bg-zinc-700 py-2 px-4 font-bold  hover:bg-zinc-500"
        >
          <BiLeftArrowAlt size={20} />
        </Link>
        <Link
          href={`/${username}/${segment}/${next}`}
          className="flex items-center justify-center rounded  bg-zinc-700 py-2 px-4 font-bold  hover:bg-zinc-500"
        >
          <BiRightArrowAlt size={20} />
        </Link>
      </div>
    </div>
  );
}
