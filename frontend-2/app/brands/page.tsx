import Filter from "@/components/Filter";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { API, brandSortOptions } from "@/utils/constants";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import BrandList from "./BrandList";

type BrandResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Brand[];
};

async function getBrandList({
  page = "1",
  search = "",
  ordering = "name",
}: {
  page?: string;
  search?: string;
  ordering?: string;
}): Promise<BrandResponse> {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(
    `${API}/brands/?page=${page}&search=${search}&ordering=${ordering}`,
    { headers }
  );
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export const metadata: Metadata = {
  title: "Brands - Trackedfitness",
  description:
    "Trackedfitness brand database, lookup food brands and find associated food",
};

export default async function BrandListPage({
  searchParams: { page = "1", search = "", ordering = "" },
}: {
  searchParams: {
    page?: string;
    search?: string;
    ordering?: string;
  };
}) {
  const brands = await getBrandList({ page, search, ordering });

  return (
    <div className="p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Brands</h1>
        <div>
          <Link
            href="/brands/create"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            New Brand
          </Link>
        </div>
      </div>

      <div className="flex flex-row-reverse">
        <div className="flex gap-4">
          <Search id="search" path="brands" />
          <Filter
            id="ordering"
            label="Sort by"
            path="brands"
            filter="ordering"
            defaultDisplay="Name (A-z)"
            defaultValue="name"
            options={brandSortOptions}
          />
        </div>
      </div>

      <BrandList brands={brands} />

      <Pagination path="brands" page={page} data={brands} />
    </div>
  );
}
