import { API } from "@/utils/constants";
import { Metadata } from "next";
import { cookies } from "next/headers";

async function getTrainingPlan(slug: string) {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/training-plans/${slug}/workouts/`, {
    headers,
  });
  return res.json();
}

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const trainingPlan = await getTrainingPlan(slug);
  return { title: `${trainingPlan.name} - Trackedfitness` };
}

export default async function TrainingPlanPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const trainingPlan = await getTrainingPlan(slug);

  return (
    <div>
      <h1 className="font-bold">{trainingPlan.name}</h1>
      {trainingPlan.map((trainingPlan) => (
        <div key={trainingPlan.id}>{trainingPlan.day}</div>
      ))}
    </div>
  );
}
