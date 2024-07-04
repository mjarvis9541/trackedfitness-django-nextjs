import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import ProgressDeleteForm from "../../../ProgressDeleteForm";
import { getProgress } from "../page";

export default async function ProgressDeletePage({
  params: { progressId },
}: {
  params: { progressId: string };
}) {
  const progress = await getProgress({ progressId });
  const token = cookies().get("accessToken")?.value;
  if (!progress) {
    notFound();
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Delete Progress</h1>

      <p>Are you sure you wish to delete this progress?</p>
      <p>This action cannot be undone.</p>

      <ProgressDeleteForm progress={progress} token={token} />
    </div>
  );
}
