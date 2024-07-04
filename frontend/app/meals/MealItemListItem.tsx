import Link from "next/link";

export default function MealItemListItem({
  mealId,
  data,
  isCheck,
  handleCheck,
}) {
  return (
    <>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        <input
          type="checkbox"
          id={data.id}
          checked={isCheck.includes(JSON.stringify(data.id))}
          onChange={handleCheck}
        />
      </div>
      <Link
        href={`/meals/${mealId}/${data.id}`}
        className="col-span-3 items-center justify-start border-b-[1px] p-2 font-bold hover:bg-gray-100 md:col-span-1 md:flex md:font-normal"
      >
        {data.food_name}, {data.brand_name}
      </Link>
      <Link
        href={`/meals/${mealId}/${data.id}/update`}
        className="flex items-center justify-end border-b-[1px] p-2 hover:bg-gray-100"
      >
        {data.data_value}
        {data.data_measurement}
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
        {data.energy}kcal
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {data.protein}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {data.carbohydrate}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {data.fat}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.saturates}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.sugars}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.fibre}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.salt}g
      </div>
    </>
  );
}
