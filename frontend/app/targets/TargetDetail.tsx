import Link from "next/link";
import { formatLongDate } from "../../utils/format-date";

export default function TargetDetail({ target }) {
  return (
    <div className="">
      <div className="flex items-center justify-between">
        <h2 className="mb-4 text-xl font-bold">Diet Targets</h2>
        <Link
          href="/diet-targets/edit"
          className="text-blue-500 hover:underline"
        >
          Edit Diet Targets
        </Link>
      </div>

      <table className="w-full border-collapse border">
        <tbody>
          <tr>
            <th className="w-1/2 border p-2 text-left">Calories</th>
            <td className="border p-2 text-right">
              {target?.energy || 0} kcal
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Protein</th>
            <td className="border p-2 text-right">
              {target?.protein || 0} g ({target?.percent_protein.toFixed()}%)
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Carbohydrate</th>
            <td className="border p-2 text-right">
              {target?.carbohydrate || 0} g (
              {target?.percent_carbohydrate.toFixed()}%)
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Fat</th>
            <td className="border p-2 text-right">
              {target?.fat || 0} g ({target?.percent_fat.toFixed()}%)
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Saturates</th>
            <td className="border p-2 text-right">
              {target?.saturates || 0} g
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Sugars</th>
            <td className="border p-2 text-right">{target?.sugars || 0} g</td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Fibre</th>
            <td className="border p-2 text-right">{target?.fibre || 0} g</td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Salt</th>
            <td className="border p-2 text-right">{target?.salt || 0} g</td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Calories per kg</th>
            <td className="border p-2 text-right">
              {target?.energy_per_kg || 0} kcal
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Protein per kg</th>
            <td className="border p-2 text-right">
              {target?.protein_per_kg || 0} g
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Carbohydrate per kg</th>
            <td className="border p-2 text-right">
              {target?.carbohydrate_per_kg || 0} g
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Fat per kg</th>
            <td className="border p-2 text-right">
              {target?.fat_per_kg || 0} g
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Last Updated</th>
            <td className="border p-2 text-right">
              {target?.updated_at &&
                formatLongDate(new Date(target?.updated_at))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
