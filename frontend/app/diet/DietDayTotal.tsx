export default function DietDayTotal({ isLoading, error, data }) {
  if (isLoading) return <div className="p-2">Loading...</div>;
  if (error) return <div className="p-2">Error</div>;

  return (
    <table className="w-full border-collapse border md:w-1/4">
      <tbody>
        <tr>
          <th className="w-1/2 border p-2 text-left">Calories</th>
          <td className="w-1/2 border p-2 text-right">
            {data[0]?.total_day_energy || 0} kcal
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Protein</th>
          <td className="border p-2 text-right">
            {data[0]?.total_day_protein || 0} g (
            {data[0]?.total_day_protein_pct.toFixed(0)}%)
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Carbohydrate</th>
          <td className="border p-2 text-right">
            {data[0]?.total_day_carbohydrate || 0} g (
            {data[0]?.total_day_carbohydrate_pct.toFixed(0)}
            %)
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fat</th>
          <td className="border p-2 text-right">
            {data[0]?.total_day_fat || 0} g (
            {data[0]?.total_day_fat_pct.toFixed(0)}%)
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Saturates</th>
          <td className="border p-2 text-right">
            {data[0]?.total_day_saturates || 0} g
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Sugars</th>
          <td className="border p-2 text-right">
            {data[0]?.total_day_sugars || 0} g
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fibre</th>
          <td className="border p-2 text-right">
            {data[0]?.total_day_fibre || 0} g
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Salt</th>
          <td className="border p-2 text-right">
            {data[0]?.total_day_salt || 0} g
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Calories per kg</th>
          <td className="border p-2 text-right">
            {data[0]?.total_day_energy_per_kg.toFixed(0) || 0} kcal
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Protein per kg</th>
          <td className="border p-2 text-right">
            {data[0]?.total_day_protein_per_kg.toFixed(1) || 0.0} g
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Carbohydrate per kg</th>
          <td className="border p-2 text-right">
            {data[0]?.total_day_carbohydrate_per_kg.toFixed(1) || 0.0} g
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fat per kg</th>
          <td className="border p-2 text-right">
            {data[0]?.total_day_fat_per_kg.toFixed(1) || 0.0} g
          </td>
        </tr>
      </tbody>
    </table>
  );
}
