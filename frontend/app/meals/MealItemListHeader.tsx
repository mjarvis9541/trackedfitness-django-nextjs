export default function MealItemListHeader({ isCheckAll, handleCheckAll }) {
  return (
    <>
      <div className="mt-3 hidden items-center justify-center border-b-[1px] p-2 md:flex">
        <input type="checkbox" checked={isCheckAll} onChange={handleCheckAll} />
      </div>
      <div className="col-span-4 mt-3 hidden items-center justify-start border-b-[1px] p-2 font-bold md:col-span-1 md:flex">
        Food
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
