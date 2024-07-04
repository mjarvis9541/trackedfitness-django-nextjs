"use client";

import useCheckDates from "@/hooks/useCheckDates";
import createMonthRange from "@/utils/create-month-range";
import ProgressListItem from "./ProgressListitem";

export default function ProgressList({
  username,
  date,
  progressList,
}: {
  username: string;
  date: string;
  progressList: Progress[];
}) {
  const monthRange = createMonthRange(date);

  const mergedProgressList = monthRange.map((dateObj) => {
    const progress = progressList.find(
      (progress) => progress.date === dateObj.date
    );
    if (progress) return { ...dateObj, ...progress };
    return dateObj;
  });

  const { isChecked, isAllChecked, handleCheck, handleCheckAll } =
    useCheckDates({ data: mergedProgressList });

  return (
    <div className="grid grid-cols-[auto_repeat(6,_minmax(0,_auto))_5fr] border-l-[1px] border-t-[1px]">
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end">
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
        Energy Burnt
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Week Avg
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Weight (kg)
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 text-end font-bold">
        Week Avg
      </div>
      <div className="border-b-[1px] border-r-[1px] p-1.5 font-bold">Notes</div>
      {mergedProgressList.map((progress) => (
        <ProgressListItem
          key={progress.date}
          username={username}
          progress={progress}
          isChecked={isChecked}
          handleCheck={handleCheck}
        />
      ))}
    </div>
  );
}
