import DietTargetForm from "../../../app/targets/DietTargetForm";
import useGetDietTargets from "../../../app/targets/useGetDietTargets";

export default function UpdateDietTargetsPage() {
  const { isLoading, error, data } = useGetDietTargets();
  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4">Error</div>;

  return (
    <div className="space-y-4 p-4">
      <h1 className="font-bold">Edit Diet Targets</h1>

      <p>
        Update your base diet targets below. Updating your weight here will
        update the weight on your profile data also.
      </p>

      <p>
        This will update your targets based on your body weight (in kilograms)
        that you input below. For example, if you weigh 100kg, and set your
        Protein (grams per kg) to 2.0g, this will set your dietary protein
        target to 200g.
      </p>

      <DietTargetForm data={data} />

      <p>
        Your total calories (kcal) will be automatically calculated from grams
        of protein, carbohydrate and fat.
      </p>
    </div>
  );
}
