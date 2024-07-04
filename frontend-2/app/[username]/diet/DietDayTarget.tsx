import Link from "next/link";

export default function DietDayTarget({
  dietTarget,
}: {
  dietTarget: Target;
}): JSX.Element {
  return (
    <div className="grid grid-cols-4 md:grid-cols-[auto_3fr_repeat(9,_minmax(0,_1fr))]">
      <div className="shover:underline col-span-4 p-2 font-bold md:col-span-3">
        <Link href="/diet-targets">Target</Link>
      </div>
      <div className="flex items-center justify-end p-2 font-bold md:flex">
        {Number(dietTarget.energy).toFixed(0) || 0}kcal
      </div>
      <div className="flex items-center justify-end p-2 font-bold md:flex">
        {Number(dietTarget.protein).toFixed(0) || 0}g
        <span className="pl-1 text-sm text-gray-400">
          ({dietTarget.percent_protein}%)
        </span>
      </div>
      <div className="flex items-center justify-end p-2 font-bold md:flex">
        {Number(dietTarget.carbohydrate).toFixed(0) || 0}g
        <span className="pl-1 text-sm text-gray-400">
          ({dietTarget.percent_carbohydrate}%)
        </span>
      </div>
      <div className="flex items-center justify-end p-2 font-bold md:flex">
        {Number(dietTarget.fat).toFixed(0) || 0}g
        <span className="pl-1 text-sm text-gray-400">
          ({dietTarget.percent_fat}%)
        </span>
      </div>
      <div className="hidden items-center justify-end p-2 font-bold md:flex">
        {Number(dietTarget.saturates).toFixed(0) || 0}g
      </div>
      <div className="hidden items-center justify-end p-2 font-bold md:flex">
        {Number(dietTarget.sugars).toFixed(0) || 0}g
      </div>
      <div className="hidden items-center justify-end p-2 font-bold md:flex">
        {Number(dietTarget.fibre).toFixed(0) || 0}g
      </div>
      <div className="hidden items-center justify-end p-2 font-bold md:flex">
        {Number(dietTarget.salt).toFixed(0) || 0}g
      </div>
    </div>
  );
}
