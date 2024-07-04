import { DietDay } from "../[username]/diet/[date]/page";

export default function DietDayWeekAvg({
  dietDayList,
}: {
  dietDayList: DietDay[];
}) {
  return (
    <div className="grid grid-cols-4 rounded border bg-white md:grid-cols-[auto_3fr_repeat(9,_minmax(0,_1fr))]">
      <div className="col-span-4 p-2 font-bold md:col-span-3">Total</div>
      <div className="flex items-center justify-end p-2 font-bold md:flex">
        {dietDayList[0]?.total_day_energy.toFixed() || 0}kcal
      </div>
      <div className="flex items-center justify-end p-2 font-bold md:flex">
        {dietDayList[0]?.total_day_protein.toFixed(1) || 0}g
        <span className="pl-1 text-sm text-gray-400">
          ({dietDayList[0]?.total_day_protein_pct.toFixed(1)}%)
        </span>
      </div>
      <div className="flex items-center justify-end p-2 font-bold md:flex">
        {dietDayList[0]?.total_day_carbohydrate.toFixed(1) || 0}g
        <span className="pl-1 text-sm text-gray-400">
          ({dietDayList[0]?.total_day_carbohydrate_pct.toFixed(1)}%)
        </span>
      </div>
      <div className="flex items-center justify-end p-2 font-bold md:flex">
        {dietDayList[0]?.total_day_fat.toFixed(1) || 0}g
        <span className="pl-1 text-sm text-gray-400">
          ({dietDayList[0]?.total_day_fat_pct.toFixed(1)}%)
        </span>
      </div>
      <div className="hidden items-center justify-end p-2 font-bold md:flex">
        {dietDayList[0]?.total_day_saturates.toFixed(1) || 0}g
      </div>
      <div className="hidden items-center justify-end p-2 font-bold md:flex">
        {dietDayList[0]?.total_day_sugars.toFixed(1) || 0}g
      </div>
      <div className="hidden items-center justify-end p-2 font-bold md:flex">
        {dietDayList[0]?.total_day_fibre.toFixed(1) || 0}g
      </div>
      <div className="hidden items-center justify-end p-2 font-bold md:flex">
        {dietDayList[0]?.total_day_salt.toFixed(2) || 0}g
      </div>
    </div>
  );
}
