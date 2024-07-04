import useGetDietTargets from "./useGetDietTargets";

export default function DietTarget() {
  const { isLoading, error, data } = useGetDietTargets();
  if (isLoading) return <div className="p-2">Loading...</div>;
  if (error) return <div className="p-2">Error</div>;

  return (
    <table className="w-full border-collapse border md:w-1/4">
      <tbody>
        <tr>
          <th className="w-1/2 border p-2 text-left">Calories</th>
          <td className="w-1/2 border p-2 text-right">
            {data.energy || 0} kcal
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Protein</th>
          <td className="border p-2 text-right">
            {data.protein || 0} g ({data.percent_protein.toFixed(0)}%)
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Carbohydrate</th>
          <td className="border p-2 text-right">
            {data.carbohydrate || 0} g ({data.percent_carbohydrate.toFixed(0)}
            %)
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fat</th>
          <td className="border p-2 text-right">
            {data.fat || 0} g ({data.percent_fat.toFixed(0)}%)
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Saturates</th>
          <td className="border p-2 text-right">{data.saturates || 0} g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Sugars</th>
          <td className="border p-2 text-right">{data.sugars || 0} g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fibre</th>
          <td className="border p-2 text-right">{data.fibre || 0} g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Salt</th>
          <td className="border p-2 text-right">{data.salt || 0} g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Calories per kg</th>
          <td className="border p-2 text-right">
            {data.energy_per_kg.toFixed(0) || 0} kcal
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Protein per kg</th>
          <td className="border p-2 text-right">
            {data.protein_per_kg || 0.0} g
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Carbohydrate per kg</th>
          <td className="border p-2 text-right">
            {data.carbohydrate_per_kg || 0.0} g
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fat per kg</th>
          <td className="border p-2 text-right">{data.fat_per_kg || 0.0} g</td>
        </tr>
      </tbody>
    </table>
  );
}
