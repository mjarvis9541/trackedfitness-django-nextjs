import MealListItem from "./MealListItem";

export default function MealList({ meals }: { meals: { results: Meal[] } }) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-[4fr_repeat(9,_minmax(0,_1fr))]">
      <div className="hidden items-center justify-start border-b-[1px] p-2 font-bold md:flex">
        Meal
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Food
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Calories
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Protein
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Carbs
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Fat
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Saturates
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Sugars
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Fibre
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 font-bold md:flex">
        Salt
      </div>
      {meals.results.map((meal: Meal) => (
        <MealListItem key={meal.id} meal={meal} />
      ))}
    </div>
  );
}
