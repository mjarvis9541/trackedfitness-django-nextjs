export default function DietMealListFooter({ isLoading, error, data }) {
  if (isLoading)
    return (
      <div className="col-span-10 border-b-[1px] bg-gray-100 p-2 font-bold">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="col-span-10 border-b-[1px] bg-gray-100 p-2 font-bold">
        Error
      </div>
    );
  const mealTotal = data && data[0];
  return (
    <>
      <div className="col-span-4 border-b-[1px] bg-gray-100 p-2 font-bold md:col-span-2">
        Total
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {mealTotal?.total_meal_energy.toFixed() || 0}kcal
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {mealTotal?.total_meal_protein.toFixed(1) || 0}g
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {" "}
        {mealTotal?.total_meal_carbohydrate.toFixed(1) || 0}g{" "}
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {mealTotal?.total_meal_fat.toFixed(1) || 0}g
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {mealTotal?.total_meal_saturates.toFixed(1) || 0}g
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {mealTotal?.total_meal_sugars.toFixed(1) || 0}g
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {mealTotal?.total_meal_fibre.toFixed(1) || 0}g
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {mealTotal?.total_meal_salt.toFixed(2) || 0}g
      </div>
    </>
  );
}
