import Link from "next/link";

export default function DietListItem({
  diet,
  isChecked,
  handleCheck,
  showCheckbox,
}: {
  diet: DietDay;
  isChecked?: string[];
  handleCheck?: () => void;
  showCheckbox: boolean;
}) {
  return (
    <>
      {showCheckbox && (
        <div className="hidden items-center justify-center border-b-[1px] md:flex">
          <input
            type="checkbox"
            value={JSON.stringify(diet.id)}
            checked={isChecked?.includes(JSON.stringify(diet.id))}
            onChange={handleCheck}
          />
        </div>
      )}
      <Link
        href={`${diet.username}/diet/${diet.date}/${diet.meal}/${diet.id}`}
        className="col-span-3 flex items-center justify-start border-b-[1px] p-2 font-bold hover:bg-gray-200 md:col-span-1 md:font-normal"
      >
        {diet.food_name}, {diet.brand_name}
      </Link>
      <Link
        href={`${diet.username}/diet/${diet.date}/${diet.meal}/${diet.id}/edit`}
        className="flex items-center justify-end border-b-[1px] p-2 hover:bg-gray-200"
      >
        {diet.data_value}
        {diet.data_measurement}
      </Link>

      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Calories
      </div>
      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Protein
      </div>
      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Carbs
      </div>
      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Fat
      </div>

      <div className="flex items-center justify-end border-b-[1px] p-2">
        {diet.energy.toFixed(0)}kcal
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {diet.protein.toFixed(1)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {diet.carbohydrate.toFixed(1)}g
      </div>
      <div className="flex items-center justify-end border-b-[1px] p-2">
        {diet.fat.toFixed(1)}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {diet.saturates.toFixed(1)}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {diet.sugars.toFixed(1)}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {diet.fibre.toFixed(1)}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {diet.salt.toFixed(2)}g
      </div>
    </>
  );
}
