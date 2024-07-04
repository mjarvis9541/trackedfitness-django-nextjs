export default function DietDetailTable({ data }) {
  return (
    <table className="mt-4 w-full border-collapse border">
      <thead>
        <tr>
          <th className="w-1/2 border p-2 text-left">Typical Values</th>
          <th className="w-1/2 border p-2 text-right">
            Per {data.data_value}
            {data.data_measurement}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th className="border p-2 text-left">Energy (kcal)</th>
          <td className="border p-2 text-right">{data.energy} kcal</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Protein</th>
          <td className="border p-2 text-right">{data.protein}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Carbohydrate</th>
          <td className="border p-2 text-right">{data.carbohydrate}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fat</th>
          <td className="border p-2 text-right">{data.fat}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Saturates</th>
          <td className="border p-2 text-right">{data.saturates}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Sugars</th>
          <td className="border p-2 text-right">{data.sugars}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fibre</th>
          <td className="border p-2 text-right">{data.fibre}g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Salt</th>
          <td className="border p-2 text-right">{data.salt}g</td>
        </tr>
      </tbody>
    </table>
  );
}
