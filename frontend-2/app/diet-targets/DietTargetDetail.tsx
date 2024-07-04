"use client";

import { formatLongDate } from "@/utils/format-date";

export default function DietTargetDetail({
  dietTarget,
}: {
  dietTarget: Target;
}) {
  return (
    <table className="w-full">
      <tbody>
        <tr>
          <th className="w-1/2 border border-zinc-500 p-2 text-left">
            Calories
          </th>
          <td className="w-1/2 border border-zinc-500 p-2 text-right">
            {Number(dietTarget.energy).toFixed(0)}kcal
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">Protein</th>
          <td className="border border-zinc-500 p-2 text-right">
            {Number(dietTarget.protein).toFixed(0)}g{" "}
            <span>({Number(dietTarget.percent_protein).toFixed(0)}%)</span>
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">Carbohydrate</th>
          <td className="border border-zinc-500 p-2 text-right">
            {Number(dietTarget.carbohydrate).toFixed(0)}g{" "}
            <span>({Number(dietTarget.percent_carbohydrate).toFixed(0)}%)</span>
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">Fat</th>
          <td className="border border-zinc-500 p-2 text-right">
            {Number(dietTarget.fat).toFixed(0)}g{" "}
            <span>({Number(dietTarget.percent_fat).toFixed(0)}%)</span>
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">Saturates</th>
          <td className="border border-zinc-500 p-2 text-right">
            {Number(dietTarget.saturates).toFixed(0)}g
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">Sugars</th>
          <td className="border border-zinc-500 p-2 text-right">
            {Number(dietTarget.sugars).toFixed(0)}g
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">Fibre</th>
          <td className="border border-zinc-500 p-2 text-right">
            {Number(dietTarget.fibre).toFixed(0)}g
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">Salt</th>
          <td className="border border-zinc-500 p-2 text-right">
            {Number(dietTarget.salt).toFixed(1)}g
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">
            Calories per kg
          </th>
          <td className="border border-zinc-500 p-2 text-right">
            {dietTarget?.energy_per_kg || 0}kcal
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">
            Protein per kg
          </th>
          <td className="border border-zinc-500 p-2 text-right">
            {dietTarget?.protein_per_kg || 0}g
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">
            Carbohydrate per kg
          </th>
          <td className="border border-zinc-500 p-2 text-right">
            {dietTarget?.carbohydrate_per_kg || 0}g
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">Fat per kg</th>
          <td className="border border-zinc-500 p-2 text-right">
            {dietTarget?.fat_per_kg || 0}g
          </td>
        </tr>
        <tr>
          <th className="border border-zinc-500 p-2 text-left">Updated</th>
          <td className="border border-zinc-500 p-2 text-right">
            {formatLongDate(dietTarget.updated_at)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
