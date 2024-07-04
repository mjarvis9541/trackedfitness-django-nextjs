"use client";

import useCheckIds from "@/hooks/useCheckIds";
import DietListFooter from "./DietListFooter";
import DietListItem from "./DietListItem";

export default function DietList({
  usernameParam,
  dateParam,
  mealListData,
  dietList,
  token,
}: {
  usernameParam: string;
  dateParam: string;
  mealListData: any;
  dietList: DietDay[];
  token: string | undefined;
}) {
  const { isChecked, isAllChecked, setIsChecked, handleCheck, handleCheckAll } =
    useCheckIds({ data: dietList });

  return (
    <div className="m-4 rounded bg-zinc-700 p-2">
      <div className="grid grid-cols-4 md:grid-cols-[auto_3fr_repeat(9,_minmax(0,_1fr))]">
        <div className="mt-3 hidden items-center justify-center border-b-[1px] p-2 md:mt-1 md:flex">
          <input
            type="checkbox"
            onChange={handleCheckAll}
            checked={isAllChecked}
          />
        </div>
        <div className="col-span-4 items-center justify-start border-b-[1px] p-2 font-bold md:col-span-1 md:mt-1 md:flex">
          {mealListData.name}
        </div>
        <div className="mt-3 hidden items-center justify-end border-b-[1px] p-2 md:mt-1 md:flex">
          Quantity
        </div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 md:mt-1 md:flex"></div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 md:mt-1 md:flex"></div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 md:mt-1 md:flex"></div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 md:mt-1 md:flex"></div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 md:mt-1 md:flex"></div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 md:mt-1 md:flex"></div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 md:mt-1 md:flex"></div>
        <div className="hidden items-center justify-end border-b-[1px] p-2 md:mt-1 md:flex"></div>
        {dietList
          .filter((diet) => diet.meal === mealListData.order)
          .map((diet: DietDay) => (
            <DietListItem
              key={diet.id}
              diet={diet}
              showCheckbox={true}
              isChecked={isChecked}
              handleCheck={handleCheck}
            />
          ))}
        <DietListFooter
          usernameParam={usernameParam}
          dateParam={dateParam}
          dietList={dietList}
          mealNumber={mealListData.order}
        />
      </div>
    </div>
  );
}
