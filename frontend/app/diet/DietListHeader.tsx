"use client";

import { useEffect, useState } from "react";

export default function DietListHeader({ data, meal, isCheck, setIsCheck }) {
  const [isMealCheckAll, setIsMealCheckAll] = useState(false);
  const mealData = data?.filter((obj) => obj.meal === meal.order);
  const isMealData = mealData?.length;

  const idList = mealData?.map((data) => JSON.stringify(data.id));
  const allMealItemsChecked = mealData?.every((v) =>
    isCheck.includes(JSON.stringify(v.id))
  );

  useEffect(() => {
    if (!allMealItemsChecked) {
      setIsMealCheckAll(false);
    }
    if (allMealItemsChecked && isMealData) {
      setIsMealCheckAll(true);
    }
  }, [isCheck]);

  const handleCheckAll = (e) => {
    const { checked, id } = e.target;

    setIsMealCheckAll(!isMealCheckAll);
    if (checked) {
      setIsCheck([...isCheck, ...idList]);
    }
    if (!checked) {
      let arr1 = isCheck;
      let arr2 = idList;
      arr1 = arr1.filter((el) => !arr2.includes(el));
      setIsCheck(arr1);
      setIsMealCheckAll(false);
    }
  };

  return (
    <>
      <div className="mt-3 hidden items-center justify-center border-b-[1px] p-2 md:flex">
        <input
          type="checkbox"
          disabled={!mealData?.length}
          checked={isMealCheckAll}
          onChange={handleCheckAll}
        />
      </div>
      <div className="col-span-4 mt-3 items-center justify-start border-b-[1px] p-2 font-bold md:col-span-1 md:flex">
        Meal {meal.order}
      </div>
      <div className="mt-3 hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
        Quantity
      </div>
      <div className="mt-3 hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
        Calories
      </div>
      <div className="mt-3 hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
        Protein
      </div>
      <div className="mt-3 hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
        Carbs
      </div>
      <div className="mt-3 hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
        Fat
      </div>
      <div className="mt-3 hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
        Saturates
      </div>
      <div className="mt-3 hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
        Sugars
      </div>
      <div className="mt-3 hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
        Fibre
      </div>
      <div className="mt-3 hidden items-center justify-end border-b-[1px] p-2 font-bold text-gray-900 md:flex">
        Salt
      </div>
    </>
  );
}
