import { API } from "@/utils/constants";
import { cookies } from "next/headers";
import FoodForm from "../FoodForm";

export async function getBrandSelect() {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/brands/select/`, { headers });
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export default async function FoodCreatePage() {
  const token = cookies().get("accessToken")?.value;
  const brandSelect = await getBrandSelect();
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Create Food</h1>
      <div className="grid grid-cols-12">
        <div className="col-span-4">
          <FoodForm brandSelect={brandSelect} token={token} />
        </div>
      </div>
    </div>
  );
}
