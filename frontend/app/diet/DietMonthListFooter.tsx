export default function DietMonthListFooter({ isCheck }) {
  return (
    <div className="col-span-full border-b-[1px] bg-gray-100 p-2">
      {isCheck.length} Selected
    </div>
  );
}
