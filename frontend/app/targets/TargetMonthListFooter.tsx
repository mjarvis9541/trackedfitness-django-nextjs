export default function TargetMonthListFooter({ isCheck }) {
  return (
    <div className="col-span-full border-b-[1px] border-r-[1px] border-l-[1px] bg-gray-100 p-2 font-bold">
      {isCheck.length} Selected
    </div>
  );
}
