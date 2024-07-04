import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import BrandDeleteForm from "../../BrandDeleteForm";
import { getBrand } from "../layout";

export default async function BrandDeletePage({
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
      <h1 className="text-2xl font-bold">Delete Brand</h1>
      <p>Are you sure you wish to delete this brand?</p>
      <p>This action cannot be undone.</p>
      <BrandDeleteForm brand={brand} token={token} />
    </div>
  );
}
