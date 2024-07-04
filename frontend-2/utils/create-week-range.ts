import {
  eachDayOfInterval,
  endOfWeek,
  format,
  formatISO,
  startOfWeek,
} from "date-fns";

export default function createWeekRange({ date }: { date: string }) {
  const now = new Date(date);
  const monday = startOfWeek(now, { weekStartsOn: 1 });
  const sunday = endOfWeek(now, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: monday, end: sunday }).map((obj) => ({
    day: format(obj, "EEEE"),
    date: formatISO(obj, { representation: "date" }),
  }));
}
