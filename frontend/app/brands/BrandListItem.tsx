"use client";

import Link from "next/link";

export default function BrandListItem({ data }) {
  return (
    <>
      <Link
        href={`/brands/${data.id}`}
        className="flex items-center justify-start border-b-[1px] p-2 hover:bg-gray-100"
      >
        {data.name}
      </Link>
      <Link
        href={`/food?page=1&search=&brand=${data.id}&ordering=name`}
        className="flex items-center justify-end border-b-[1px] p-2 hover:bg-gray-100"
      >
        {data.food_count}
      </Link>
      <Link
        href={`/${data.created_by_username}`}
        className="flex items-center justify-end border-b-[1px] p-2 hover:bg-gray-100"
      >
        {data.created_by_username}
      </Link>
    </>
  );
}
