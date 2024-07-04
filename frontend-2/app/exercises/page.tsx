import { API } from "@/utils/constants";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import ExerciseList from "./ExerciseList";

type Exercise = {
  id: string;
  name: string;
  slug: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
};

type Exercises = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Exercise[];
};

export const metadata: Metadata = {
  title: "Exercises - Trackedfitness",
  description: "Diet and fitness tracking web application",
};

async function getExerciseList(): Promise<Exercises> {
  const token = cookies().get("accessToken")?.value;
  const headers: FetchHeaders = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `JWT ${token}`;
  }
  const res = await fetch(`${API}/exercises/`, { headers });
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res.json();
}

export default async function ExerciseListPage({ params }: { params: {} }) {
  const exercises = await getExerciseList();

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between">
        <h1 className="text-xl font-bold">Exercises</h1>
        <div>
          <Link href="/exercises/create">Create</Link>
        </div>
      </div>
      <ExerciseList exerciseList={exercises} />
    </div>
  );
}
