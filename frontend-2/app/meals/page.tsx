import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { API, mealSortOptions } from "@/utils/constants";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import MealList from "./MealList";

export const metadata: Metadata = {
  title: "Meals - Trackedfitness",
  description:
    "Trackedfitness meal database, meals are collection of food and associated quantities, useful for quick additional to the food diary/diet log",
};

export async function getMealList({
  page = "1",
  search = "",
  ordering = "name",
}: {
  page?: string;
  search?: string;
  ordering?: string;
}) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(
    `${API}/meals/?page=${page}&search=${search}&ordering=${ordering}`,
    { headers }
  );
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export default async function MealListPage({
  searchParams: { page = "1", search = "", ordering = "" },
}: {
  searchParams: {
    page?: string;
    search?: string;
    ordering?: string;
  };
}) {
  const mealList = await getMealList({ page, search, ordering });
  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Meals</h1>
        <div>
          <Link
            href="/meals/create"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            New Meal
          </Link>
        </div>
      </div>

      <div className="flex flex-row-reverse">
        <div className="flex gap-4">
          <Search id="search" path="meals" />
          <Filter
            id="ordering"
            label="Sort by"
            path="meals"
            filter="ordering"
            defaultDisplay="Name (A-z)"
            defaultValue="name"
            options={mealSortOptions}
          />
        </div>
      </div>

      <MealList meals={mealList} />
      <Pagination path="meals" page={page} data={mealList} />
    </div>
  );
}
