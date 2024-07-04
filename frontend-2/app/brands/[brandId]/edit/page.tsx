import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import BrandForm from "../../BrandForm";
import { getBrand } from "../layout";

export default async function BrandUpdatePage({
  params: { brandId },
}: {
  params: { brandId: string };
}) {
  const brand = await getBrand({ brandId });
  const token = cookies().get("accessToken")?.value;
  if (!brand) {
    notFound();
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Brand</h1>
      <BrandForm brand={brand} token={token} />
    </div>
  );
}
