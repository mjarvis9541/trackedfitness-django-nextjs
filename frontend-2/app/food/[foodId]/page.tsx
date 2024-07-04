import { API } from "@/utils/constants";
import { formatDateTime } from "@/utils/format-date";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import FoodFormDiet from "../FoodFormDiet";
import FoodFormMeal from "../FoodFormMeal";

export async function getFood({ foodId }: { foodId: string }) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/food/${foodId}/`, {
    headers,
  });
  if (res.status === 404) {
    return;
  }
  if (!res.ok) {
    throw {
      message: `Request failed with status code ${res.status}`,
      response: {
        data: res.status < 404 && (await res.json()),
        status: res.status,
        statusText: res.statusText,
      },
    };
  }
  return res.json();
}

export default async function FoodDetailPage({
  params: { foodId },
}: {
  params: { foodId: string };
}) {
  const food = await getFood({ foodId });
  if (!food) {
    notFound();
  }
  const token = cookies().get("accessToken")?.value;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{food.name}</h1>
      <div>
        <Link
          href={`/brands/${food.brand}`}
          className="text-blue-500 hover:underline"
        >
          {food.brand_name}
        </Link>
      </div>
      <div>
        Created by{" "}
        <Link
          href={`/${food.created_by_username}`}
          className="capitalize text-blue-500 hover:underline"
        >
          {food.created_by_username}
        </Link>{" "}
        <span className="text-sm text-gray-500">
          (updated {formatDateTime(food.updated_at)})
        </span>
      </div>

      <div className="flex justify-end gap-4">
        <Link href={`/food/${foodId}/edit`} className="text-blue-500">
          Edit
        </Link>
        <Link href={`/food/${foodId}/delete`} className="text-blue-500">
          Delete
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-bold">Add to Diet</h2>
        <FoodFormDiet food={food} token={token} />
      </div>
      <div>
        <h2 className="text-xl font-bold">Add to Meal</h2>
        <FoodFormMeal food={food} token={token} />
      </div>
    </div>
  );
}
