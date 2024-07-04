import Link from "next/link";
import TargetDetail from "../../app/targets/TargetDetail";
import useGetDietTargets from "../../app/targets/useGetDietTargets";

export default function DietTargetsPage() {
  const { isLoading, error, data } = useGetDietTargets();
  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error</div>;

  return (
    <>
      <div className="space-y-4 p-4">
        <h1 className="text-xl font-bold">Diet Targets</h1>
        <p>
          These are your daily dietary calorie and macronutrient targets. Your
          base targets are your current diet targets that are applied to every
          calendar day by default. You can override these targets on an
          individual daily basis if you wish. This is useful for cyclic dieting,
          such carb cycling or ramping your calories up or down for a
          competition or event.
        </p>

        <p>
          If you set individual diet targets for the day these will take
          precedence over your base diet targets.
        </p>

        <h2 className="font-bold">Base Targets</h2>

        <p>These are your default diet targets.</p>

        <TargetDetail target={data} />

        <div>
          <Link
            href="/diet-targets/edit"
            className="text-blue-600 hover:underline"
          >
            Edit
          </Link>
        </div>

        <div className="space-y-4 text-gray-500 line-through">
          <h2 className="font-bold">Targets Day</h2>

          <p>These are your individual daily diet targets.</p>

          <p>You have not set any individual diet targets for today.</p>

          <div>
            <Link
              href="/diet-targets/edit-day"
              className="text-blue-600 hover:underline"
            >
              Edit
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
