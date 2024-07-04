import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  formatISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";

const createMonthRange = (date) => {
  const now = new Date(date);
  const startMonth = startOfMonth(now);
  const endMonth = endOfMonth(now);
  const monday = startOfWeek(startMonth, { weekStartsOn: 1 });
  const sunday = endOfWeek(endMonth, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: monday, end: sunday }).map((obj) => ({
    date: formatISO(obj, { representation: "date" }),
  }));
};

export default createMonthRange;
