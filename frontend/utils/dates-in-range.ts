import { formatISO, getISOWeek, subDays, subWeeks } from "date-fns";

const getDatesInRange = (startDate, endDate) => {
  let week = 1;
  let iteration = 0;
  const date = new Date(startDate);
  const dates = [];

  while (date <= endDate) {
    iteration++;
    dates.push({ date: formatISO(new Date(date), { representation: "date" }) });
    date.setDate(date.getDate() + 1);
    if (iteration === 7) {
      dates.push({
        date: `Week ${getISOWeek(subWeeks(new Date(date), 1))}`,
        total: true,

        start: formatISO(subWeeks(new Date(date), 1), {
          representation: "date",
        }),
        end: formatISO(subDays(new Date(date), 1), { representation: "date" }),
      });
      iteration = 0;
      week++;
    }
  }
  return dates;
};

export default getDatesInRange;

// const getDatesInRange = (startDate, endDate) => {
//   let week = 1;
//   let iteration = 0;
//   const date = new Date(startDate);
//   const dates = [];

//   while (date <= endDate) {
//     iteration++;
//     dates.push({ date: formatISO(new Date(date), { representation: "date" }) });
//     date.setDate(date.getDate() + 1);
//     if (iteration === 7) {
//       dates.push({
//         date: `Week ${getISOWeek(new Date(date))}`,
//         total: true,
//         start: formatISO(subWeeks(new Date(date), 1), {
//           representation: "date",
//         }),
//         end: formatISO(subDays(new Date(date), 1), { representation: "date" }),
//       });
//       iteration = 0;
//       week++;
//     }
//   }
//   return dates;
// };

// return eachDayOfInterval({ start: monday, end: sunday }).map((obj) => ({

//   date: formatISO(obj, { representation: "date" }),

// export default getDatesInRange;
