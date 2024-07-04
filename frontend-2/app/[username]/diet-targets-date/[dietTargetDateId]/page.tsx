import DietTargetDetail from "@/app/diet-targets/DietTargetDetail";
import { API } from "@/utils/constants";
import { formatLongDate } from "@/utils/format-date";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function getDietTargetDate({
  dietTargetDateId,
}: {
  dietTargetDateId: string;
}) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/diet-targets/${dietTargetDateId}/`, {
    headers,
  });
  if (res.status === 404) {
    return notFound();
  }
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export default async function dietTargetDateDetailPage({
  params: { dietTargetDateId },
}: {
  params: { dietTargetDateId: string };
}) {
  const dietTargetDate = await getDietTargetDate({ dietTargetDateId });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Diet Targets - {formatLongDate(dietTargetDate.date)}
      </h1>

      <DietTargetDetail dietTarget={dietTargetDate} />

      <div>
        <Link
          href={`/diet-targets-date/${dietTargetDateId}/edit`}
          className="text-blue-500 hover:underline"
        >
          Edit
        </Link>
      </div>

      <div>
        <Link
          href={`/diet-targets-date/${dietTargetDateId}/delete`}
          className="text-blue-500 hover:underline"
        >
          Delete
        </Link>
      </div>
    </div>
  );
}
