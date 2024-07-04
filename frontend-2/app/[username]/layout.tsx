import { API } from "@/utils/constants";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export async function getUser({ username }: { username: string }) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/users/${username}/`, { headers });
  if (res.status === 404) {
    notFound();
  }
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export default async function UserLayout({
  children,
  params: { username },
}: {
  children: React.ReactNode;
  params: {
    username: string;
  };
}) {
  const user = await getUser({ username });

  return (
    <main className="p-4">
      <div>{children}</div>
    </main>
  );
}
