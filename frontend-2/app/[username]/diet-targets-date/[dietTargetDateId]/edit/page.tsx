import { formatLongDate } from "@/utils/format-date";
import { cookies } from "next/headers";
import DietTargetDateForm from "../../DietTargetDateForm";
import { getDietTargetDate } from "../page";

export default async function DietTargetDateUpdatePage({
  params: { dietTargetDateId },
}: {
  params: { dietTargetDateId: string };
}) {
  const dietTargetDate = await getDietTargetDate({ dietTargetDateId });
  const token = cookies().get("accessToken")?.value;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Edit Diet Targets - {formatLongDate(dietTargetDate.date)}
      </h1>
      <div className="max-w-sm">
        <DietTargetDateForm dietTargetDate={dietTargetDate} token={token} />
      </div>
    </div>
  );
}
