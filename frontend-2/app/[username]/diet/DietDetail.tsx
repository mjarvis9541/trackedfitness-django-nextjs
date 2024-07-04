import { DietDay } from "../[username]/diet/page";

export default function DietDetail({ diet }: { diet: DietDay }) {
  return (
    <table className="mt-4 w-full border-collapse border">
      <thead>
        <tr>
          <th className="w-1/2 border p-2 text-left">Typical Values</th>
          <th className="w-1/2 border p-2 text-right">
            Per {diet.data_value}
            {diet.data_measurement}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th className="border p-2 text-left">Energy (kcal)</th>
          <td className="border p-2 text-right">{diet.energy} kcal</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Protein</th>
          <td className="border p-2 text-right">{diet.protein}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Carbohydrate</th>
          <td className="border p-2 text-right">{diet.carbohydrate}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fat</th>
          <td className="border p-2 text-right">{diet.fat}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Saturates</th>
          <td className="border p-2 text-right">{diet.saturates}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Sugars</th>
          <td className="border p-2 text-right">{diet.sugars}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fibre</th>
          <td className="border p-2 text-right">{diet.fibre}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Salt</th>
          <td className="border p-2 text-right">{diet.salt}g</td>
        </tr>
      </tbody>
    </table>
  );
}
