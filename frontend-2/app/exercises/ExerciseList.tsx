import ExerciseListItem from "./ExerciseListItem";

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

export default function ExerciseList({
  exerciseList,
}: {
  exerciseList: Exercises;
}) {
  return (
    <div>
      <div className="grid grid-cols-3">
        <div className="p-2 font-bold">Exercise</div>
        <div className="p-2 font-bold">Created</div>
        <div className="p-2 font-bold">Updated</div>
        {exerciseList.results.map((exercise: Exercise) => (
          <ExerciseListItem key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}
