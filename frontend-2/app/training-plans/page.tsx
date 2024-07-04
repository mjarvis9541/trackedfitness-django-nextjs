import { API } from "@/utils/constants";
import { cookies } from "next/headers";
import Link from "next/link";
import TrainingPlanListItem from "./TrainingPlanListItem";

export const metadata = {
  title: "Training Plans - Trackedfitness",
};

async function getTrainingPlans(): Promise<TrainingPlanList> {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/training-plans/`, { headers });
  if (!res.ok) {
    throw new Error("not ok");
  }
  return res.json();
}

export default async function TrainingPlanListPage() {
  const trainingPlans = await getTrainingPlans();

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Training Plans</h1>
        <Link
          href="/training-plans/create"
          className="rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600"
        >
          New
        </Link>
      </div>
      {trainingPlans.results.map((trainingPlan) => (
        <TrainingPlanListItem
          key={trainingPlan.id}
          trainingPlan={trainingPlan}
        />
      ))}
    </div>
  );
}
