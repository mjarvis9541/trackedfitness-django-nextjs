import Link from "next/link";

export default function FoodListItem({ food }: { food: Food }) {
  return (
    <div className="content">
      <Link href={`/food/${food.slug}`} className="">
        {food.name}
      </Link>
      <Link href={`/brands/${food.brand}`} className="">
        {food.brand_name}
      </Link>
      <Link href={`/food/${food.id}/edit`} className="">
        {food.data_value}
        {food.data_measurement}
      </Link>

      <div className="">Calories</div>
      <div className="">Protein</div>
      <div className="">Carbs</div>
      <div className="">Fat</div>

      <div className="">{food.energy}kcal</div>
      <div className="">{food.protein}g</div>
      <div className="">{food.carbohydrate}g</div>
      <div className="">{food.fat}g</div>
      <div className="">{food.saturates}g</div>
      <div className="">{food.sugars}g</div>
      <div className="">{food.fibre}g</div>
      <div className="">{food.salt}g</div>
    </div>
  );
}
