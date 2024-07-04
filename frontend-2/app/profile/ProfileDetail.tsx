import { formatLongDate } from "@/utils/format-date";
import { Profile } from "./page";

export default function ProfileDetail({ profile }: { profile: Profile }) {
  return (
    <table className="w-full">
      <tbody>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">Fitness Goal</th>
          <td className="border border-zinc-500 p-2 text-right">
            {profile.get_goal_display}
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">
            Activity Level
          </th>
          <td className="border border-zinc-500 p-2 text-right">
            {profile.get_activity_level_display}
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">Sex</th>
          <td className="border border-zinc-500 p-2 text-right">
            {profile.get_sex_display}
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">Height</th>
          <td className="border border-zinc-500 p-2 text-right">
            {Number(profile.height).toFixed(0)} cm
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">Weight</th>
          <td className="border border-zinc-500 p-2 text-right">
            {Number(profile.weight).toFixed(1)} kg
          </td>
        </tr>

        <tr>
          <th className="border border-zinc-500 p-2 text-left">
            Body Mass Index (BMI)
          </th>
          <td className="border border-zinc-500 p-2 text-right">
            {profile.bmi}
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">
            Basal Metabolic Rate (BMR)
          </th>
          <td className="border border-zinc-500 p-2 text-right">
            {profile.bmr} kcal
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">
            Total Daily Energy Expenditure (TDEE)
          </th>
          <td className="border border-zinc-500 p-2 text-right">
            {profile.tdee} kcal
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">Updated</th>
          <td className="border border-zinc-500 p-2 text-right">
            {formatLongDate(profile.updated_at)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
