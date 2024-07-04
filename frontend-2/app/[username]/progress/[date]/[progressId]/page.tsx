import { API } from "@/utils/constants";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function getProgress({ progressId }: { progressId: string }) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/progress/${progressId}/`, { headers });
  if (res.status === 404) {
    return;
  }
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export default async function ProgressDetailPage({
  params: { progressId },
}: {
  params: { progressId: string };
}) {
  const progress = await getProgress({ progressId });
  if (!progress) {
    notFound();
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Progress</h1>

      <pre>{JSON.stringify(progress, null, 2)}</pre>

      <div>
        <Link
          href={`/progress/${progressId}/edit`}
          className="text-blue-500 hover:underline"
        >
          Edit
        </Link>
      </div>

      <div>
        <Link
          href={`/progress/${progressId}/delete`}
          className="text-blue-500 hover:underline"
        >
          Delete
        </Link>
      </div>
    </div>
  );
}
