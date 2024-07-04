import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import FoodDeleteForm from "../../FoodDeleteForm";
import { getFood } from "../page";

export default async function FoodDeletePage({
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
      <h1 className="text-2xl font-bold">Delete Food</h1>
      <p>Are you sure you wish to delete this food?</p>
      <p>This action cannot be undone.</p>
      <FoodDeleteForm food={food} token={token} />
    </div>
  );
}
