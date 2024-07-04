import useCheckDates from "@/hooks/useCheckDates";
import createMonthRange from "@/utils/create-month-range";
import DietTargetDateListItem from "./DietTargetDateListItem";

export default function DietTargetDateList({
  username,
  date,
  dietTargetDateList,
}: {
  username: string;
  date: string;
  dietTargetDateList: DietTargetDate[];
}) {
  const monthRange = createMonthRange(date);
  const mergedDietTargetDateList = monthRange.map((dateObj) => {
    const dietTargetDate = dietTargetDateList.find(
      (dietTargetDate) => dietTargetDate.date === dateObj.date
    );
    if (dietTargetDate) return { ...dateObj, ...dietTargetDate };
    return dateObj;
  });
  const { isChecked, isAllChecked, handleCheck, handleCheckAll } =
    useCheckDates({
      data: mergedDietTargetDateList,
    });
  return (
    <>
      <div className="border-b-[1px] border-r-[1px] p-1.5 font-bold">
        <input
          type="checkbox"
          onChange={handleCheckAll}
          checked={isAllChecked}
        />
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Date
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Day
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Calories
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Protein
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Carbs
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Fat
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Saturates
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Sugars
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Fibre
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Salt
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Cals/kg
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Pro/kg
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Carbs/kg
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Fat/kg
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Pro %
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Carb %
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Fat %
      </div>
      {mergedDietTargetDateList.map((dietTargetDate) => (
        <DietTargetDateListItem
          key={dietTargetDate.date}
          username={username}
          dietTargetDate={dietTargetDate}
          isChecked={isChecked}
          handleCheck={handleCheck}
        />
      ))}
    </>
  );
}
