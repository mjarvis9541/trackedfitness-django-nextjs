export default function TargetTable({ targetState }) {
  return (
    <table className="w-full border-collapse border">
      <tbody>
        <tr>
          <th className="w-1/2 border p-2 text-left">Weight</th>
          <td className="border p-2 text-right">{targetState.weight} kg</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Calories</th>
          <td className="border p-2 text-right">{targetState.energy} kcal</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Protein</th>
          <td className="border p-2 text-right">{targetState.protein} g</td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Carbohydrate</th>
          <td className="border p-2 text-right">
            {targetState.carbohydrate} g
          </td>
        </tr>
        <tr>
          <th className="border p-2 text-left">Fat</th>
          <td className="border p-2 text-right">{targetState.fat} g</td>
        </tr>
      </tbody>
    </table>
  );
}
