import createWeekRange from "@/utils/create-week-range";
import DietTargetDateWeekListItem from "./DietTargetDateWeekListItem";
import { DietTargetWeek } from "./page";

export default function DietTargetDateWeekList({
  date,
  username,
  dietTargetDateWeekList,
}: {
  date: string;
  username: string;
  dietTargetDateWeekList: DietTargetWeek[];
}) {
  const weekRange = createWeekRange({ date });

  const mergedDietTargetDateWeekList = weekRange.map((dateObj) => {
    const dietTargetDate = dietTargetDateWeekList.find(
      (dietTargetDate) => dietTargetDate.date === dateObj.date
    );
    if (dietTargetDate) return { ...dateObj, ...dietTargetDate };
    return {
      ...dateObj,
      username: username,
      energy: 0,
      protein: 0,
      carbohydrate: 0,
      fat: 0,
      saturates: 0,
      sugars: 0,
      fibre: 0,
      salt: 0,
      weight: 0,
      energy_per_kg: 0,
      protein_per_kg: 0,
      carbohydrate_per_kg: 0,
      fat_per_kg: 0,
      percent_protein: 0,
      percent_carbohydrate: 0,
      percent_fat: 0,
      created_at: 0,
      updated_at: 0,
    };
  });

  const total = dietTargetDateWeekList.find((obj: any) => obj.username) || {
    total_week_energy: 0,
    total_week_protein: 0,
    total_week_fat: 0,
    total_week_carbohydrate: 0,
    total_week_saturates: 0,
    total_week_sugars: 0,
    total_week_fibre: 0,
    total_week_salt: 0,
  };

  return (
    <div className="grid rounded border border-zinc-500 p-2 md:grid-cols-[auto_repeat(15,_minmax(0,_1fr))]">
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
      {mergedDietTargetDateWeekList.map((dietTargetDateWeek) => (
        <DietTargetDateWeekListItem
          key={dietTargetDateWeek.date}
          dietTargetDateWeek={dietTargetDateWeek}
        />
      ))}
      <div className="col-span-3 border-t-[1px] p-2 font-bold">Total</div>
      <div className="border-t-[1px] p-2 text-end font-bold"></div>
      <div className="border-t-[1px] p-2 text-end font-bold"></div>
      <div className="border-t-[1px] p-2 text-end font-bold"></div>
      <div className="border-t-[1px] p-2 text-end font-bold"></div>
      <div className="border-t-[1px] p-2 text-end font-bold"></div>
      <div className="border-t-[1px] p-2 text-end font-bold"></div>
      <div className="border-t-[1px] p-2 text-end font-bold"></div>
      <div className="border-t-[1px] p-2 text-end font-bold"></div>
      <div className="border-t-[1px] p-2 text-end font-bold"></div>
      <div className="border-t-[1px] p-2 text-end font-bold"></div>
      <div className="border-t-[1px] p-2 text-end font-bold"></div>
      <div className="border-t-[1px] p-2 text-end font-bold"></div>
      <div className="border-t-[1px] p-2 text-end font-bold"></div>
    </div>
  );
}
