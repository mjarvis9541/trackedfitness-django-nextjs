import Image from "next/image";
import Link from "next/link";
import fitness from "../../public/fitness.png";

export default function TrainingPlanListItem({
  trainingPlan,
}: {
  trainingPlan: TrainingPlan;
}) {
  return (
    <div className="mt-4 flex gap-4 rounded bg-zinc-200 p-2 text-zinc-900">
      <Image src={fitness} alt="Picture of dumbbell" width={75} height={75} />
      <div>
        <Link
          href={`/training-plans/${trainingPlan.slug}`}
          className="font-bold"
        >
          {trainingPlan.name}
        </Link>
        <p className="text-sm text-zinc-400">
          Duration: {trainingPlan.duration} weeks
        </p>
        <p className="text-sm">{trainingPlan.description}</p>
      </div>
    </div>
  );
}
