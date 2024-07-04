import MealItemDeleteForm from "@/app/meals/ItemDeleteForm";
import { cookies } from "next/headers";

export default function MealItemDeletePage({
  params: { mealId, mealItemId },
}: {
  params: { mealId: string; mealItemId: string };
}) {
  const token = cookies().get("accessToken")?.value;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Delete Meal Item</h1>
      <p>Are you sure you wish to delete this meal item?</p>
      <p>This action cannot be undone.</p>

      <MealItemDeleteForm
        mealId={mealId}
        mealItemId={mealItemId}
        token={token}
      />
    </div>
  );
}
