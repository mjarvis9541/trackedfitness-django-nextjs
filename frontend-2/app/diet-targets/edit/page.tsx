import { cookies } from "next/headers";
import DietTargetForm from "../DietTargetForm";
import { getDietTarget } from "../page";

export default async function DietTargetUpdatePage() {
  const accessToken = cookies().get("accessToken")?.value;
  const dietTarget = await getDietTarget({ username: "michael" });

  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold">Update Diet Targets</h1>

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

      <p>
        Your total calories (kcal) will be automatically calculated from grams
        of protein, carbohydrate and fat.
      </p>

      <DietTargetForm dietTarget={dietTarget} token={accessToken} />
    </div>
  );
}
