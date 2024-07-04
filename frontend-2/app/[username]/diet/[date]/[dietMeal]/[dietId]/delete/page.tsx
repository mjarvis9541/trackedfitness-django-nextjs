import DietDeleteForm from "@/app/[username]/diet/DietDeleteForm";
import { formatLongDate } from "@/utils/format-date";
import { cookies } from "next/headers";

import { getDiet } from "../page";

export default async function DietDeletePage({
  params: { dietId },
}: {
  params: { dietId: string };
}) {
  const diet = await getDiet({ dietId });
  const token = cookies().get("accessToken")?.value;
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">
          Delete {diet.food_name}, {diet.brand_name}, {diet.data_value}
          {diet.data_measurement}
        </h1>
        <p className="text-2xl font-bold">
          Meal {diet.meal}, {formatLongDate(diet.date)}
        </p>
      </div>

      <p>Are you sure you wish to delete this diet entry?</p>

      <p>This action cannot be undone.</p>

      <DietDeleteForm diet={diet} token={token} />
    </div>
  );
}
