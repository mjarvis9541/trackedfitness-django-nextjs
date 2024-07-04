export default function TargetWeekListFooter({
  isLoading,
  error,
  total,
}: {
  isLoading: boolean;
  error: string;
  total: any;
}) {
  if (isLoading)
    return (
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        Error
      </div>
    );
  return (
    <>
      <div className="col-span-3 border-b-[1px] bg-gray-100 p-2 font-bold">
        Total
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(total.energy).toLocaleString()} kcal
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(total.protein).toFixed(0)}g{" "}
        <span className="text-sm font-normal text-gray-400">
          ({Number(total.percent_protein).toFixed(0)}%)
        </span>
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(total.carbohydrate).toFixed(0)}g{" "}
        <span className="text-sm font-normal text-gray-400">
          ({Number(total.percent_carbohydrate).toFixed(0)}%)
        </span>
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(total.fat.toFixed(0))}g{" "}
        <span className="text-sm font-normal text-gray-400">
          ({Number(total.percent_fat).toFixed(0)}%)
        </span>
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(total.saturates).toFixed(0)}g
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(total.sugars).toFixed(0)}g
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(total.fibre).toFixed(0)}g
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(total.salt).toFixed(1)}g
      </div>
      <div className="col-span-5 border-b-[1px] bg-gray-100 p-2 text-end font-bold"></div>
    </>
  );
}
