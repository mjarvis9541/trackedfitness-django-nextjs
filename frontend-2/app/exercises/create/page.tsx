import { cookies } from "next/headers";
import ExerciseForm from "../ExerciseForm";

export default function ExerciseCreatePage() {
  const token = cookies().get("accessToken")?.value;
  return (
    <div>
      <h1 className="text-2xl font-bold">Create Exercise</h1>
      <ExerciseForm token={token} />
    </div>
  );
}
