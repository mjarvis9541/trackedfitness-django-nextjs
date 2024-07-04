export default function ProgressListFooter({ isCheck }) {
  return (
    <div className="col-span-8 border-b-[1px] bg-gray-100 p-2">
      {isCheck.length} Selected
    </div>
  );
}
