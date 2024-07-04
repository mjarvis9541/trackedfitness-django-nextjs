import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { API, foodSortOptions } from "@/utils/constants";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { BiListPlus } from "react-icons/bi";
import { getBrandSelect } from "./create/page";
import FoodList from "./FoodList";

export const metadata: Metadata = {
  title: "Food - Trackedfitness",
  description:
    "Trackedfitness food database, lookup food and associated calorie and macronutrient nutritional values",
};

export async function getFoodList({
  page = "1",
  search = "",
  brand = "",
  ordering = "name",
}: {
  page?: string;
  search?: string;
  brand?: string;
  ordering?: string;
}) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(
    `${API}/food/?page=${page}&brand=${brand}&search=${search}&ordering=${ordering}`,
    { headers }
  );
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export default async function FoodListPage({
  searchParams: { page = "1", search = "", brand = "", ordering = "" },
}: {
  searchParams: {
    page: string;
    search: string;
    brand: string;
    ordering: string;
  };
}) {
  const brandData = getBrandSelect();
  const foodData = getFoodList({ page, search, brand, ordering });
  const [food, brands] = await Promise.all([foodData, brandData]);

  return (
    <main className="p-4">
      <div>
        <Link
          href="/food/create"
          className="flex items-center gap-2 rounded bg-zinc-500 py-1.5 px-3 text-sm font-bold hover:bg-zinc-400"
        >
          <BiListPlus size={20} /> New
        </Link>
      </div>

      <div className="flex flex-row-reverse">
        <div className="flex gap-4">
          <Search id="search" path="food" />
          <Filter
            id="ordering"
            label="Sort by"
            path="food"
            filter="ordering"
            defaultDisplay="Name (A-z)"
            defaultValue="name"
            options={foodSortOptions}
          />
        </div>
      </div>

      <FoodList food={food} />
      <Pagination path="food" page={page} data={food} />
    </main>
  );
}
