import Link from "next/link";
import { formatLongDate } from "../../utils/format-date";

export default function ProfileDetail({ profile }) {
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-xl font-bold">Profile</h2>
        <Link href="/profile/edit" className="text-blue-500 hover:underline">
          Edit Profile
        </Link>
      </div>

      <table className="w-full border-collapse border">
        <tbody>
          <tr>
            <th className="border p-2 text-left">Fitness Goal</th>
            <td className="border p-2 text-right">
              {profile?.get_goal_display}
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Activity Level</th>
            <td className="border p-2 text-right">
              {profile?.get_activity_level_display}
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Sex</th>
            <td className="border p-2 text-right">
              {profile?.get_sex_display}
            </td>
          </tr>
          <tr>
            <th className="w-1/2 border p-2 text-left">Height</th>
            <td className="border p-2 text-right">{profile?.height} cm</td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Weight</th>
            <td className="border p-2 text-right">{profile?.weight} kg</td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Body Mass Index (BMI)</th>
            <td className="border p-2 text-right">{profile?.bmi}</td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Basal Metabolic Rate (BMR)</th>
            <td className="border p-2 text-right">{profile?.bmr} kcal</td>
          </tr>
          <tr>
            <th className="border p-2 text-left">
              Total Daily Energy Expenditure (TDEE)
            </th>
            <td className="border p-2 text-right">{profile?.tdee} kcal</td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Last Updated</th>
            <td className="border p-2 text-right">
              {profile?.updated_at &&
                formatLongDate(new Date(profile?.updated_at))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
