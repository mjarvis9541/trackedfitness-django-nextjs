import Link from "next/link";

export default function FoodListItem({ data }) {
  return (
    <>
      <Link
        href={`/food/${data.id}`}
        className="col-span-4 flex items-center justify-start pb-0.5 pr-2 pl-2 pt-2 font-bold hover:bg-gray-100 md:col-span-1 md:border-b-[1px] md:bg-white md:p-2 md:font-normal"
      >
        {data.name}
      </Link>
      <Link
        href={`/brands/${data.brand}`}
        className="col-span-3 flex items-center justify-start pt-0.5 pl-2 pr-2 pb-1.5 text-sm font-bold hover:bg-gray-100 md:col-span-1 md:border-b-[1px] md:p-2 md:text-base md:font-normal"
      >
        {data.brand_name}
      </Link>
      <Link
        href={`/food/${data.id}/update`}
        className="flex items-center justify-end pt-0.5 pl-2 pr-2 pb-1.5 text-right text-sm font-bold hover:bg-gray-100 md:border-b-[1px] md:p-2 md:text-base md:font-normal"
      >
        {data.data_value}
        {data.data_measurement}
      </Link>

      <div className="flex justify-end pt-1 pb-0 pr-2 pl-2  text-xs text-gray-500 md:hidden">
        Calories
      </div>
      <div className="flex justify-end pt-1 pb-0 pr-2 pl-2  text-xs text-gray-500 md:hidden">
        Protein
      </div>
      <div className="flex justify-end pt-1 pb-0 pr-2 pl-2  text-xs text-gray-500 md:hidden">
        Carbs
      </div>
      <div className="flex justify-end pt-1 pb-0 pr-2 pl-2  text-xs text-gray-500 md:hidden">
        Fat
      </div>

      <div className="mb-4 flex items-center justify-end border-b-[1px] pt-0.5 pr-2 pl-2 pb-2 md:mb-0 md:p-2">
        {data.energy}kcal
      </div>
      <div className="mb-4 flex items-center justify-end border-b-[1px] pt-0.5 pr-2 pl-2 pb-2 md:mb-0 md:p-2">
        {data.protein}g
      </div>
      <div className="mb-4 flex items-center justify-end border-b-[1px] pt-0.5 pr-2 pl-2 pb-2 md:mb-0 md:p-2">
        {data.carbohydrate}g
      </div>
      <div className="mb-4 flex items-center justify-end border-b-[1px] pt-0.5 pr-2 pl-2 pb-2 md:mb-0 md:p-2">
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
      <Link
        href={`/${data.created_by_username}`}
        className="hidden items-center justify-end border-b-[1px] p-2 hover:bg-gray-100 md:flex"
      >
        {data.created_by_username}
      </Link>
    </>
  );
}
