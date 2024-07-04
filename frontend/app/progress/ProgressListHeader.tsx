export default function ProgressListHeader({ isCheckAll, handleCheckAll }) {
  return (
    <>
      <div className="border-b-[1px] border-r-[1px] p-2 font-bold">
        <input type="checkbox" onChange={handleCheckAll} checked={isCheckAll} />
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 font-bold">Date</div>
      <div className="border-b-[1px] border-r-[1px] p-2 font-bold">Day</div>
      <div className="border-b-[1px] border-r-[1px] p-2 font-bold">
        Energy Burnt
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 font-bold">
        Week Avg
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 font-bold">Weight</div>
      <div className="border-b-[1px] border-r-[1px] p-2 font-bold">
        Week Avg
      </div>
      <div className="border-b-[1px] border-r-[1px] p-2 font-bold">Notes</div>
      {/* <div className="border-b-[1px] border-r-[1px] p-2 font-bold">Updated</div> */}
    </>
  );
}
