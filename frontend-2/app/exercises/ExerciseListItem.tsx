import Link from "next/link";
import { Exercise } from "./page";

export default function ExerciseListItem({ exercise }: { exercise: Exercise }) {
  return (
    <>
      <div className="">
        <Link href={`/exercises/${exercise.slug}`} className="hover:underline">
          {exercise.name}
        </Link>
      </div>
      <div className="">{exercise.created_at}</div>
      <div className="">{exercise.updated_at}</div>
    </>
  );
}
