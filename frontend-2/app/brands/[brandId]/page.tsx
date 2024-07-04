import { formatDateTime } from "@/utils/format-date";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBrand } from "./layout";

export default async function BrandDetailPage({
  params: { brandId },
}: {
  params: { brandId: string };
}) {
  const brand = await getBrand({ brandId });
  if (!brand) {
    notFound();
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{brand.name}</h1>
      <div>
        <Link
          href={`/${brand.created_by_username}`}
          className="capitalize text-blue-500 hover:underline"
        >
          {brand.created_by_username}
        </Link>
      </div>
      <p>
        Created by {brand.created_by_username} on{" "}
        {formatDateTime(brand.created_at)}{" "}
        <span className="text-sm text-gray-500">
          (updated: {formatDateTime(brand.updated_at)})
        </span>
      </p>

      <p>Food: {brand.food_count}</p>

      <pre>{JSON.stringify(brand, null, 2)}</pre>

      <div>
        <Link
          href={`/brands/${brandId}/edit`}
          className="text-blue-500 hover:underline"
        >
          Edit
        </Link>
      </div>
      <div>
        <Link
          href={`/brands/${brandId}/delete`}
          className="text-blue-500 hover:underline"
        >
          Delete
        </Link>
      </div>
    </div>
  );
}
