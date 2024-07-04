import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { API } from "./constants";

type APIResponse = {
  status: number;
  statusText: string;
  data: any;
  error: any;
  loading: boolean;
};

export default async function serverFetch({ url }: { url: string }) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/${url}`, { headers });

  if (res.status === 404) {
    notFound();
  }
  if (res.status === 403) {
    throw new Error();
  }
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}
