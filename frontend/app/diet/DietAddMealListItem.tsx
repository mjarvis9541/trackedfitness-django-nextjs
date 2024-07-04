import Link from "next/link";

export default function DietAddMealListItem({
  data,
  handleAdd,
  createMutation,
}) {
  return (
    <>
      <Link
        href={`/meals/${data.id}`}
        className="col-span-3 flex items-center justify-start bg-gray-100 p-2 hover:bg-gray-100 md:col-span-1 md:border-b-[1px] md:bg-white"
      >
        {data.name}
      </Link>
      <Link
        href={`/${data.created_by_username}`}
        className="hidden items-center justify-end border-b-[1px] p-2 hover:bg-gray-100 md:flex"
      >
        {data.created_by_username}
      </Link>
      <div className="flex items-center justify-end bg-gray-100 p-2 md:border-b-[1px] md:bg-white">
        {data.food_count}
      </div>

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

      <div className="flex items-center justify-end p-2 md:border-b-[1px]">
        {data.energy} kcal
      </div>
      <div className="flex items-center justify-end p-2 md:border-b-[1px]">
        {data.protein} g
      </div>
      <div className="flex items-center justify-end p-2 md:border-b-[1px]">
        {data.carbohydrate} g
      </div>
      <div className="flex items-center justify-end p-2 md:border-b-[1px]">
        {data.fat} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.saturates} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.sugars} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.fibre} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {data.salt} g
      </div>
      <div className="col-span-4 flex items-center justify-end border-b-[1px] p-2 md:col-span-1">
        <button
          className="rounded bg-gray-500 px-4 py-2 text-gray-100 hover:bg-amber-400"
          onClick={() => handleAdd(data.id)}
          disabled={createMutation.isLoading}
        >
          Add
        </button>
      </div>
    </>
  );
}
