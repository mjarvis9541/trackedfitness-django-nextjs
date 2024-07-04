import { API } from "@/utils/constants";
import { Metadata } from "next";
import { cookies } from "next/headers";

async function getExerciseDetail({
  slug,
}: {
  slug: string;
}): Promise<Exercise> {
  const accessToken = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (accessToken) {
    headers["Authorization"] = `JWT ${accessToken}`;
  }
  const res = await fetch(`${API}/exercises/${slug}/`, { headers });
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const exercise = await getExerciseDetail({ slug });
  return { title: `${exercise.name} - Trackedfitness` };
}

export default async function ExerciseDetailPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const exercise = await getExerciseDetail({ slug });
  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">{exercise.name}</h1>
      <pre>{JSON.stringify(exercise, null, 2)}</pre>
    </div>
  );
}
