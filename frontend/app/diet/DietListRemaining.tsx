"use client";

export default function DietListRemaining({ isLoading, error, data }) {
  if (isLoading)
    return (
      <div className="col-span-4 bg-gray-100 p-2 font-bold md:col-span-11">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="col-span-4 bg-gray-100 p-2 font-bold md:col-span-11">
        Error
      </div>
    );
  return (
    <>
      <div className="col-span-4 bg-gray-100 p-2 font-bold md:col-span-3">
        Remaining
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
        {data[0]?.remaining_energy || 0} kcal
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
        {data[0]?.remaining_protein || 0} g
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
        {data[0]?.remaining_carbohydrate || 0} g
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
        {data[0]?.remaining_fat || 0} g
      </div>
      <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:flex">
        {data[0]?.remaining_saturates || 0} g
      </div>
      <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:flex">
        {data[0]?.remaining_sugars || 0} g
      </div>
      <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:flex">
        {data[0]?.remaining_fibre || 0} g
      </div>
      <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:flex">
        {data[0]?.remaining_salt || 0} g
      </div>
    </>
  );
}
