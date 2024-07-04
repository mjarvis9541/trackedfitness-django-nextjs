export default function DietMealListItem({ data }) {
  return (
    <>
      <div className="border-b-[1px] p-2">{data.food_name}</div>
      <div className="border-b-[1px] p-2 text-end">
        {data.data_value}
        {data.data_measurement}
      </div>
      <div className="border-b-[1px] p-2 text-end">
        {data.energy.toFixed(0)} kcal
      </div>
      <div className="border-b-[1px] p-2 text-end">
        {data.protein.toFixed(1)}g
      </div>
      <div className="border-b-[1px] p-2 text-end">
        {data.carbohydrate.toFixed(1)}g
      </div>
      <div className="border-b-[1px] p-2 text-end">{data.fat.toFixed(1)}g</div>
      <div className="hidden border-b-[1px] p-2 text-end md:block">
        {data.saturates.toFixed(1)}g
      </div>
      <div className="hidden border-b-[1px] p-2 text-end md:block">
        {data.sugars.toFixed(1)}g
      </div>
      <div className="hidden border-b-[1px] p-2 text-end md:block">
        {data.fibre.toFixed(1)}g
      </div>
      <div className="hidden border-b-[1px] p-2 text-end md:block">
        {data.salt.toFixed(1)}g
      </div>
    </>
  );
}
