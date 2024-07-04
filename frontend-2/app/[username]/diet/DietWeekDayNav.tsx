import createWeekRange from "@/utils/create-week-range";
import Link from "next/link";

export default function DietWeekDayNav({
  username,
  date,
  meal,
  path,
}: {
  username: string;
  date: string;
  meal?: string;
  path?: string;
}) {
  const dateRange = createWeekRange({ date });
  return (
    <div className="flex gap-4">
      {dateRange.map((date) => (
        <Link
          href={
            !meal
              ? `/${username}/diet/${date.date}`
              : `/${username}/diet/${date.date}/${meal}/${path}`
          }
          key={date.date}
          className="w-1/6 rounded border-[1px] bg-gray-200 p-1.5 text-center text-sm hover:bg-gray-300"
        >
          <h3>{date.day}</h3>
          <p>{date.date}</p>
        </Link>
      ))}
    </div>
  );
}
