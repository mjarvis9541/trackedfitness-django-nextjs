import { formatLongDate } from "@/utils/format-date";
import { cookies } from "next/headers";

import { getDietTargetDate } from "../page";

export default async function DietTargetDateDeletePage({
  params: { dietTargetDateId },
}: {
  params: { dietTargetDateId: string };
}) {
  const dietTargetDate = await getDietTargetDate({ dietTargetDateId });
  const token = cookies().get("accessToken")?.value;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Delete Diet Targets - {formatLongDate(dietTargetDate.date)}
      </h1>

      <p>
        Are you sure you wish to delete your diet targets for{" "}
        {formatLongDate(dietTargetDate.date)}?
      </p>

      <p>This action cannot be undone.</p>
    </div>
  );
}
