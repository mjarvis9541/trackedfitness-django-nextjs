import { API } from "@/utils/constants";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Meal, MealItem } from "../../page";
import { getMeal } from "../page";

export async function getMealItem({ mealItemId }: { mealItemId: string }) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/items/${mealItemId}/`, { headers });
  if (res.status === 404) {
    return;
  }
  if (!res.ok) {
    throw new Error("Failed to fetch meal item");
  }
  return res.json();
}

export default async function MealItemDetailPage({
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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {mealItem.food_name}, {mealItem.brand_name}, {mealItem.data_value}
        {mealItem.data_measurement}
      </h1>
      <div>
        <Link
          href={`/meals/${mealId}/${mealItemId}/edit`}
          className="text-blue-500 hover:underline"
        >
          Edit Meal Item
        </Link>
      </div>
      <div>
        <Link
          href={`/meals/${mealId}/${mealItemId}/delete`}
          className="text-blue-500 hover:underline"
        >
          Delete Meal Item
        </Link>
      </div>
    </div>
  );
}
