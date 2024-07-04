import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProgressForm from "../../../ProgressForm";
import { getProgress } from "../page";

export default async function ProgressUpdatePage({
  params: { progressId },
}: {
  params: { progressId: string };
}) {
  const progress = await getProgress({ progressId });
  if (!progress) {
    notFound();
  }
  const token = cookies().get("accessToken")?.value;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Progress</h1>

      <div className="max-w-sm">
        <ProgressForm progress={progress} token={token} />
      </div>
    </div>
  );
}
