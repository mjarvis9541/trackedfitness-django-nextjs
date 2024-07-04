"use client";
import useCheckIds from "@/hooks/useCheckIds";
import ItemListItem from "./ItemListItem";

export default function ItemList({
  meal,
  mealItems,
}: {
  meal: Meal;
  mealItems: MealItem[];
}) {
  const { isChecked, handleCheck, isAllChecked, handleCheckAll } = useCheckIds({
    data: mealItems,
  });

  return (
    <div className="grid grid-cols-4 md:grid-cols-[auto_3fr_repeat(9,_minmax(0,_1fr))]">
      <div className="hidden items-center justify-start border-b-[1px] p-2 font-bold md:flex">
        <input
          type="checkbox"
          onChange={handleCheckAll}
          checked={isAllChecked}
        />
      </div>
      <div className="hidden items-center justify-start border-b-[1px] p-2 font-bold md:flex">
        Food
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Quantity
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Calories
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Protein
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Carbs
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Fat
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Saturates
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Sugars
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Fibre
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Salt
      </div>
      {mealItems.map((item: MealItem) => (
        <ItemListItem
          key={item.id}
          mealId={meal.id}
          item={item}
          isChecked={isChecked}
          handleCheck={handleCheck}
        />
      ))}
      <div className="col-span-3 border-b-[1px] p-2 font-bold">Total</div>
      <div className="border-b-[1px] p-2 text-end font-bold">
        {meal.energy}kcal
      </div>
      <div className="border-b-[1px] p-2 text-end font-bold">
        {meal.protein}g
      </div>
      <div className="border-b-[1px] p-2 text-end font-bold">
        {meal.carbohydrate}g
      </div>
      <div className="border-b-[1px] p-2 text-end font-bold">{meal.fat}g</div>
      <div className="border-b-[1px] p-2 text-end font-bold">
        {meal.saturates}g
      </div>
      <div className="border-b-[1px] p-2 text-end font-bold">
        {meal.sugars}g
      </div>
      <div className="border-b-[1px] p-2 text-end font-bold">{meal.fibre}g</div>
      <div className="border-b-[1px] p-2 text-end font-bold">{meal.salt}g</div>
    </div>
  );
}
