import FoodListItem from "./FoodListItem";

export default function FoodList({ food }: { food: { results: Food[] } }) {
  return (
    <div className="grid grid-cols-12">
      <div className="hidden items-center justify-start border-b-[1px] p-1.5 font-bold md:flex">
        Food
      </div>
      <div className="hidden items-center justify-start border-b-[1px] p-1.5 font-bold md:flex">
        Brand
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-1.5 font-bold md:flex">
        Quantity
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-1.5 font-bold md:flex">
        Calories
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-1.5 font-bold md:flex">
        Protein
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-1.5 font-bold md:flex">
        Carbs
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-1.5 font-bold md:flex">
        Fat
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-1.5 font-bold md:flex">
        Saturates
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-1.5 font-bold md:flex">
        Sugars
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-1.5 font-bold md:flex">
        Fibre
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-1.5 font-bold md:flex">
        Salt
      </div>
      {food.results.map((food: Food) => (
        <FoodListItem key={food.id} food={food} />
      ))}
    </div>
  );
}
