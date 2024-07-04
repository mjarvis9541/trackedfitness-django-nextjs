import createMonthRange from "@/utils/create-month-range";
import DietListItem from "./DietListItem";

export default function DietMonth({
  date,
  dietList,
}: {
  date: string;
  dietList: DietDay[];
}) {
  const monthRange = createMonthRange(date);

  const mergedDietList = monthRange.map((dateObj) => {
    const diet = dietList.find((diet) => diet.date === dateObj.date);
    if (diet) return { ...dateObj, ...diet };
    return { ...dateObj, id: 0 };
  });

  return (
    <>
      {mergedDietList.map((diet) => (
        <DietListItem key={diet.date} diet={diet} />
      ))}
    </>
  );
}
