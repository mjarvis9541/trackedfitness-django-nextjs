import { cookies } from "next/headers";
import MealForm from "../MealForm";

export default function MealCreatePage() {
  const token: string | undefined = cookies().get("accessToken")?.value;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Create Meal</h1>
      <div className="max-w-sm">
        <MealForm token={token} />
      </div>
    </div>
  );
}
