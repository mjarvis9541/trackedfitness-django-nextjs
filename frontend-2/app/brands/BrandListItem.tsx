import { formatDateTime } from "@/utils/format-date";
import Link from "next/link";

export default function BrandListItem({ brand }: { brand: Brand }) {
  return (
    <>
      <Link
        href={`/brands/${brand.id}`}
        className="flex items-center justify-start truncate border-b-[1px] p-2 hover:bg-gray-200"
      >
        {brand.name}
      </Link>
      <Link
        href={`/food?page=1&search=&brand=${brand.id}&ordering=name`}
        className="flex items-center justify-end border-b-[1px] p-2 hover:bg-gray-200"
      >
        {brand.food_count}
      </Link>
      <Link
        href={`/${brand.created_by_username}`}
        className="flex items-center justify-end border-b-[1px] p-2 hover:bg-gray-200"
      >
        {brand.created_by_username}
      </Link>
      <div className="flex items-center justify-end border-b-[1px] p-2 text-sm">
        {formatDateTime(brand.updated_at)}
      </div>
    </>
  );
}
