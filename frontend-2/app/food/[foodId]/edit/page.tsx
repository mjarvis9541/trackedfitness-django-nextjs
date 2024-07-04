import { cookies } from "next/headers";
import { getBrandSelect } from "../../create/page";
import FoodForm from "../../FoodForm";
import { getFood } from "../page";

export default async function FoodUpdatePage({
  params: { foodId },
}: {
  params: { foodId: string };
}) {
  const foodFetch = getFood({ foodId });
  const brandSelectFetch = getBrandSelect();
  const [food, brandSelect] = await Promise.all([foodFetch, brandSelectFetch]);
  const token = cookies().get("accessToken")?.value;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Food</h1>
      <div className="max-w-md">
        <FoodForm food={food} brandSelect={brandSelect} token={token} />
      </div>
    </div>
  );
}
