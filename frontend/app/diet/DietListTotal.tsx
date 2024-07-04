"use client";

export default function DietListTotal({ isLoading, error, data }) {
  if (isLoading)
    return (
      <div className="col-span-11 bg-gray-100 p-2 font-bold md:mt-4">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="col-span-11 bg-gray-100 p-2 font-bold md:mt-4">Error</div>
    );
  return (
    <>
      <div className="col-span-4 mt-4 bg-gray-100 p-2 font-bold md:col-span-3">
        Total
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold md:mt-4 md:flex">
        {data[0]?.total_day_energy.toFixed() || 0}kcal
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold md:mt-4 md:flex">
        {data[0]?.total_day_protein.toFixed(1) || 0}g
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold md:mt-4 md:flex">
        {data[0]?.total_day_carbohydrate.toFixed(1) || 0}g
      </div>
      <div className="flex items-center justify-end bg-gray-100 p-2 font-bold md:mt-4 md:flex">
        {data[0]?.total_day_fat.toFixed(1) || 0}g
      </div>
      <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:mt-4 md:flex">
        {data[0]?.total_day_saturates.toFixed(1) || 0}g
      </div>
      <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:mt-4 md:flex">
        {data[0]?.total_day_sugars.toFixed(1) || 0}g
      </div>
      <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:mt-4 md:flex">
        {data[0]?.total_day_fibre.toFixed(1) || 0}g
      </div>
      <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:mt-4 md:flex">
        {data[0]?.total_day_salt.toFixed(2) || 0}g
      </div>
    </>
  );
}
