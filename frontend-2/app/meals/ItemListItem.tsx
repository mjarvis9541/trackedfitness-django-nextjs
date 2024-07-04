import Link from "next/link";

export default function ItemListItem({
  mealId,
  item,
  isChecked,
  handleCheck,
}: {
  mealId: number;
  item: MealItem;
  isChecked: string[];
  handleCheck: (e: any) => void;
}) {
  return (
    <>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        <input
          type="checkbox"
          value={item.id}
          checked={isChecked.includes(JSON.stringify(item.id))}
          onChange={handleCheck}
        />
      </div>
      <Link
        href={`/meals/${mealId}/${item.id}`}
        className="col-span-3 items-center justify-start border-b-[1px] p-2 font-bold hover:bg-gray-100 md:col-span-1 md:flex md:font-normal"
      >
        {item.food_name}, {item.brand_name}
      </Link>
      <Link
        href={`/meals/${mealId}/${item.id}/update`}
        className="flex items-center justify-end border-b-[1px] p-2 hover:bg-gray-100"
      >
        {item.data_value}
        {item.data_measurement}
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
        {item.energy}kcal
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {item.protein}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {item.carbohydrate}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {item.fat}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {item.saturates}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {item.sugars}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {item.fibre}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {item.salt}g
      </div>
    </>
  );
}
