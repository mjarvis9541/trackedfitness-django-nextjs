import { cookies } from "next/headers";
import DietTargetDateForm from "../DietTargetDateForm";

export default function DietTargetDateCreatePage({
  searchParams: { date },
}: {
  searchParams: { date?: string };
}) {
  const token = cookies().get("accessToken")?.value;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Create Diet Target</h1>
      <div className="max-w-sm">
        <DietTargetDateForm date={date} token={token} />
      </div>
    </div>
  );
}
