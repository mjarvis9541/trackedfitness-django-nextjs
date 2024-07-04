import DietDetail from "@/app/[username]/diet/DietDetail";
import { DietDay } from "@/app/[username]/diet/page";
import { API } from "@/utils/constants";
import { formatLongDate } from "@/utils/format-date";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function getDiet({ dietId }: { dietId: string }) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/diet/${dietId}/`, { headers });
  if (res.status === 404) {
    return;
  }
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export default async function DietDetailPage({
  params: { dietId },
}: {
  params: { dietId: string };
}) {
  const diet: DietDay = await getDiet({ dietId });
  if (!diet) {
    notFound();
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">
          {diet.food_name}, {diet.brand_name}, {diet.data_value}
          {diet.data_measurement}
        </h1>
        <p className="text-2xl font-bold">
          Meal {diet.meal}, {formatLongDate(diet.date)}
        </p>
      </div>

      <DietDetail diet={diet} />

      <div>
        <Link
          href={`/${diet.username}/diet/${diet.date}/${diet.meal}/${dietId}/edit`}
          className="text-blue-500 hover:underline"
        >
          Edit
        </Link>
      </div>
      <div>
        <Link
          href={`/${diet.username}/diet/${diet.date}/${diet.meal}/${dietId}/delete`}
          className="text-blue-500 hover:underline"
        >
          Delete
        </Link>
      </div>
    </div>
  );
}
