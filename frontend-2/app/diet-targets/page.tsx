import { API } from "@/utils/constants";
import { cookies } from "next/headers";
import Link from "next/link";
import DietTargetDetail from "./DietTargetDetail";

export async function getDietTarget({ username }: { username: string }) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/targets/${username}/`, { headers });
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export default async function DietTargetPage() {
  const target = await getDietTarget({ username: "michael" });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Diet Targets</h1>

      <DietTargetDetail dietTarget={target} />

      <div>
        <Link
          href="/diet-targets/edit"
          className="text-blue-500 hover:underline"
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
