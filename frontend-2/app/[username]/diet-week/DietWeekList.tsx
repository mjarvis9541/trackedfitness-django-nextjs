import createWeekRange from "@/utils/create-week-range";
import DietWeekListItem from "./DietWeekListItem";

export default function DietWeekList({
  date,
  username,
  dietWeekList,
}: {
  date: string;
  username: string;
  dietWeekList: DietWeek[];
}) {
  const weekRange = createWeekRange({ date });
  const mergedDietWeekList = weekRange.map((dateObj) => {
    const dietWeek = dietWeekList.find(
      (dietWeek) => dietWeek.date === dateObj.date
    );
    if (dietWeek) return { ...dateObj, ...dietWeek };
    return {
      ...dateObj,
      username: username,
      total_day_energy: 0,
      total_day_fat: 0,
      total_day_saturates: 0,
      total_day_carbohydrate: 0,
      total_day_sugars: 0,
      total_day_fibre: 0,
      total_day_protein: 0,
      total_day_salt: 0,
      total_day_energy_per_kg: 0,
      total_day_protein_per_kg: 0,
      total_day_carbohydrate_per_kg: 0,
      total_day_fat_per_kg: 0,
      total_day_protein_pct: 0,
      total_day_carbohydrate_pct: 0,
      total_day_fat_pct: 0,
      total_week_energy: 0,
      total_week_protein: 0,
      total_week_fat: 0,
      total_week_carbohydrate: 0,
      total_week_saturates: 0,
      total_week_sugars: 0,
      total_week_fibre: 0,
      total_week_salt: 0,
      avg_week_energy: 0,
      avg_week_protein: 0,
      avg_week_fat: 0,
      avg_week_carbohydrate: 0,
      avg_week_saturates: 0,
      avg_week_sugars: 0,
      avg_week_fibre: 0,
      avg_week_salt: 0,
      total_week_energy_per_kg: 0,
      total_week_protein_per_kg: 0,
      total_week_carbohydrate_per_kg: 0,
      total_week_fat_per_kg: 0,
      total_week_protein_pct: 0,
      total_week_carbohydrate_pct: 0,
      total_week_fat_pct: 0,
      last_updated_at: "",
    };
  });
  const total = dietWeekList.find((obj: any) => obj.username) || {
    total_week_energy: 0,
    total_week_protein: 0,
    total_week_fat: 0,
    total_week_carbohydrate: 0,
    total_week_saturates: 0,
    total_week_sugars: 0,
    total_week_fibre: 0,
    total_week_salt: 0,
    total_week_energy_per_kg: 0,
    total_week_protein_per_kg: 0,
    total_week_carbohydrate_per_kg: 0,
    total_week_fat_per_kg: 0,
    avg_week_energy: 0,
    avg_week_protein: 0,
    avg_week_fat: 0,
    avg_week_carbohydrate: 0,
    avg_week_saturates: 0,
    avg_week_sugars: 0,
    avg_week_fibre: 0,
    avg_week_salt: 0,
  };

  return (
    <div className="grid rounded border border-zinc-800 p-2 md:grid-cols-[auto_repeat(15,_minmax(0,_1fr))]">
      <div className="border-b-[1px] p-2 text-center font-bold">
        <input type="checkbox" />
      </div>
      <div className="border-b-[1px] p-2 font-bold">Date</div>
      <div className="border-b-[1px] p-2 font-bold">Day</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Calories</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Protein</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Carbs</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Fat</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Saturates</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Sugars</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Fibre</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Salt</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Cals/kg</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Pro/kg</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Carbs/kg</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Fat/kg</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Updated</div>
      {mergedDietWeekList.map((dietWeek) => (
        <DietWeekListItem key={dietWeek.date} dietWeek={dietWeek} />
      ))}
      <div className="col-span-3 border-t-[1px] p-2 font-bold">Total</div>
      <div className="border-t-[1px] p-2 text-end font-bold">
        {total.total_week_energy.toFixed(0)}kcal
      </div>
      <div className="border-t-[1px] p-2 text-end font-bold">
        {total.total_week_protein.toFixed(0)}g
      </div>
      <div className="border-t-[1px] p-2 text-end font-bold">
        {total.total_week_carbohydrate.toFixed(0)}g
      </div>
      <div className="border-t-[1px] p-2 text-end font-bold">
        {total.total_week_fat.toFixed(0)}g
      </div>
      <div className="border-t-[1px] p-2 text-end font-bold">
        {total.total_week_saturates.toFixed(0)}g
      </div>
      <div className="border-t-[1px] p-2 text-end font-bold">
        {total.total_week_sugars.toFixed(0)}g
      </div>
      <div className="border-t-[1px] p-2 text-end font-bold">
        {total.total_week_fibre.toFixed(0)}g
      </div>
      <div className="border-t-[1px] p-2 text-end font-bold">
        {total.total_week_salt.toFixed(1)}g
      </div>
      <div className="border-t-[1px] p-2 text-end font-bold">
        {total.total_week_energy_per_kg}kcal
      </div>
      <div className="border-t-[1px] p-2 text-end font-bold">
        {total.total_week_protein_per_kg.toFixed(1)}g
      </div>
      <div className="border-t-[1px] p-2 text-end font-bold">
        {total.total_week_carbohydrate_per_kg.toFixed(1)}g
      </div>
      <div className="border-t-[1px] p-2 text-end font-bold">
        {total.total_week_fat_per_kg.toFixed(1)}g
      </div>
      <div className="border-t-[1px] p-2 text-end font-bold"></div>
      <div className="col-span-3 pr-2 pl-2 pb-2 text-sm font-bold text-gray-400">
        Average
      </div>
      <div className="pr-2 pl-2 pb-2 text-end text-sm font-bold text-gray-400">
        {total.avg_week_energy.toFixed(0)}kcal
      </div>
      <div className="pr-2 pl-2 pb-2 text-end text-sm font-bold text-gray-400">
        {total.avg_week_protein.toFixed(0)}g
      </div>
      <div className="pr-2 pl-2 pb-2 text-end text-sm font-bold text-gray-400">
        {total.avg_week_carbohydrate.toFixed(0)}g
      </div>
      <div className="pr-2 pl-2 pb-2 text-end text-sm font-bold text-gray-400">
        {total.avg_week_fat.toFixed(0)}g
      </div>
      <div className="pr-2 pl-2 pb-2 text-end text-sm font-bold text-gray-400">
        {total.avg_week_saturates.toFixed(0)}g
      </div>
      <div className="pr-2 pl-2 pb-2 text-end text-sm font-bold text-gray-400">
        {total.avg_week_sugars.toFixed(0)}g
      </div>
      <div className="pr-2 pl-2 pb-2 text-end text-sm font-bold text-gray-400">
        {total.avg_week_fibre.toFixed(0)}g
      </div>
      <div className="pr-2 pl-2 pb-2 text-end text-sm font-bold text-gray-400">
        {total.avg_week_salt.toFixed(1)}g
      </div>
      <div className="pr-2 pl-2 pb-2 text-end text-sm font-bold text-gray-400"></div>
      <div className="pr-2 pl-2 pb-2 text-end text-sm font-bold text-gray-400"></div>
      <div className="pr-2 pl-2 pb-2 text-end text-sm font-bold text-gray-400"></div>
      <div className="pr-2 pl-2 pb-2 text-end text-sm font-bold text-gray-400"></div>
      <div className="pr-2 pl-2 pb-2 text-end text-sm font-bold text-gray-400"></div>
    </div>
  );
}
