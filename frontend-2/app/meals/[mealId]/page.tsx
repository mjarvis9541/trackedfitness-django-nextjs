import { API } from "@/utils/constants";
import { formatDateTime } from "@/utils/format-date";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import ItemList from "../ItemList";

export async function getMeal({ mealId }: { mealId: string }) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/meals/${mealId}/`, { headers });
  if (res.status === 404) {
    return;
  }
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export async function getMealItems({ mealId }: { mealId: string }) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/meals/${mealId}/items/`, { headers });
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export const metadata: Metadata = {
  title: "Meals - Trackedfitness",
  description: "Meals created by the community",
};

export default async function MealDetailPage({
  params: { mealId },
}: {
  params: { mealId: string };
}) {
  const mealData = getMeal({ mealId });
  const itemData = getMealItems({ mealId });
  const [meal, items] = await Promise.all([mealData, itemData]);
  if (!meal) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{meal.name}</h1>
      <p>
        Created by {meal.username} on {formatDateTime(meal.created_at)}
      </p>
      <div className="flex gap-4">
        <Link
          href={`/meals/${mealId}/edit`}
          className="text-blue-500 hover:underline"
        >
          Rename Meal
        </Link>
        <Link
          href={`/meals/${mealId}/delete`}
          className="text-blue-500 hover:underline"
        >
          Delete Meal
        </Link>
      </div>
      <div>
        <Link
          href={`/meals/${mealId}/add-food`}
          className="text-blue-500 hover:underline"
        >
          Add Food
        </Link>
      </div>
      <ItemList meal={meal} mealItems={items} />
    </div>
  );
}
