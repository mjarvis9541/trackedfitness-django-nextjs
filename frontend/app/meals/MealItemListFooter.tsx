export default function MealItemListFooter({ isLoading, error, data }) {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <>
      <div className="col-span-4 flex items-center justify-start  bg-gray-100 p-2 font-bold md:col-span-3 md:border-b-[1px]">
        Total
      </div>
      <div className="flex items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold">
        {Number(data.energy).toFixed(0)}kcal
      </div>
      <div className="flex items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold">
        {Number(data.protein).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold">
        {Number(data.carbohydrate).toFixed(1)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold">
        {Number(data.fat).toFixed(1)}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold md:flex">
        {Number(data.saturates).toFixed(1)}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold md:flex">
        {Number(data.sugars).toFixed(1)}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold md:flex">
        {Number(data.fibre).toFixed(1)}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] bg-gray-100 p-2 font-bold md:flex">
        {Number(data.salt).toFixed(2)}g
      </div>
    </>
  );
}
