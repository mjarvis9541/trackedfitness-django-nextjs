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
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { formatLongDate } from "../utils/format-date";

interface Props {
  username: string;
  date: string;
  segment: string;
  modifier: "day" | "week" | "month" | "year";
}

const DateNav = ({ username, date, segment, modifier }: Props) => {
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
    <div className="mt-3 flex items-center justify-between">
      <div className="text-xl font-bold">{formatLongDate(now)}</div>
      <div className="flex gap-2">
        <Link
          href={`/${username}/${segment}`}
          className="flex items-center justify-center rounded border py-1 px-3 hover:bg-gray-200"
        >
          Today
        </Link>
        <Link
          href={`/${username}/${segment}/${previous}`}
          className="flex items-center justify-center rounded border py-1 px-3 hover:bg-gray-200"
        >
          <FiChevronLeft />
        </Link>
        <Link
          href={`/${username}/${segment}/${next}`}
          className="flex items-center justify-center rounded border py-1 px-3 hover:bg-gray-200"
        >
          <FiChevronRight />
        </Link>
      </div>
    </div>
  );
};

export default DateNav;
