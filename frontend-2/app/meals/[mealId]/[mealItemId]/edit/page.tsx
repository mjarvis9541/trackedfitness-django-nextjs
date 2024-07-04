import MealItemForm from "@/app/meals/ItemForm";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getMeal } from "../../page";
import { getMealItem } from "../page";

export default async function MealItemUpdatePage({
  params: { mealId, mealItemId },
}: {
  params: { mealId: string; mealItemId: string };
}) {
  const mealData = getMeal({ mealId });
  const mealItemData = getMealItem({ mealItemId });

  const [meal, mealItem]: [meal: Meal, mealItem: MealItem] = await Promise.all([
    mealData,
    mealItemData,
  ]);

  if (!meal || !mealItem) {
    notFound();
  }
  const token = cookies().get("accessToken")?.value;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Meal Item</h1>
      <MealItemForm token={token} mealItem={mealItem} />
    </div>
  );
}
