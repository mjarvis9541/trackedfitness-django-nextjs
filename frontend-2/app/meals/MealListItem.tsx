import Link from "next/link";

export default function MealListItem({ meal }: { meal: Meal }) {
  return (
    <>
      <Link
        href={`/meals/${meal.id}`}
        className="col-span-4 flex items-center justify-start truncate bg-gray-200 p-2 font-bold hover:bg-gray-200 md:col-span-1 md:border-b-[1px] md:bg-transparent md:font-normal"
      >
        {meal.name}
      </Link>

      <Link
        href={`/meals/${meal.id}/add-food`}
        className="hidden items-center justify-end bg-gray-200 p-2 font-bold hover:bg-gray-200 md:flex md:border-b-[1px] md:bg-transparent md:font-normal"
      >
        {meal.food_count}
      </Link>

      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Calories
      </div>
      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Protein
      </div>
      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Carbs
      </div>
      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Fat
      </div>

      <div className="flex items-center justify-end border-b-[1px] p-2">
        {meal.energy || 0}kcal
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {meal.protein || 0}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {meal.carbohydrate || 0}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {meal.fat || 0}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {meal.saturates || 0}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {meal.sugars || 0}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {meal.fibre || 0}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {meal.salt || 0}g
      </div>
    </>
  );
}
