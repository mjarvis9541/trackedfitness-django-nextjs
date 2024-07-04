import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import MealDeleteForm from "../../MealDeleteForm";
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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Delete Meal</h1>
      <p>Are you sure you wish to delete this meal: {meal.name}?</p>
      <p>This action cannot be undone.</p>
      <MealDeleteForm meal={meal} token={token} />
    </div>
  );
}
