export default function DietWeekListHeader({
  isCheckAll,
  handleCheckAll,
}: {
  isCheckAll: boolean;
  handleCheckAll: () => void;
}) {
  return (
    <>
      <div className="border-b-[1px] p-2 font-bold">
        <input type="checkbox" onChange={handleCheckAll} checked={isCheckAll} />
      </div>
      <div className="border-b-[1px] p-2 text-end font-bold">Date</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Day</div>
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
    </>
  );
}
