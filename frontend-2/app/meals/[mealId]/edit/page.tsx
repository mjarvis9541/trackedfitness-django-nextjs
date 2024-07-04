import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import MealForm from "../../MealForm";
import { getMeal, getMealItems } from "../page";

export default async function MealDeletePage({
  params: { mealId },
}: {
  params: { mealId: string };
}) {
  const mealFetch = getMeal({ mealId });
  const itemFetch = getMealItems({ mealId });
  const [meal, items] = await Promise.all([mealFetch, itemFetch]);
  if (!meal) {
    notFound();
  }
  const token: string | undefined = cookies().get("accessToken")?.value;

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit {meal.name}</h1>
      <MealForm meal={meal} token={token} />
    </div>
  );
}
