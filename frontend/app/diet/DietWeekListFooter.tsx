export default function DietWeekListFooter({
  isLoading,
  error,
  data,
}: {
  isLoading: boolean;
  error: string;
  data: any;
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
  const week = data.find((obj: any) => obj.username);
  return (
    <>
      <div className="col-span-3 border-b-[1px] bg-gray-100 p-2 font-bold">
        Total
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(week?.total_week_energy || 0).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}{" "}
        kcal
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(week?.total_week_protein || 0).toFixed(0)}g{" "}
        <span className="text-sm font-normal text-gray-400">
          ({Number(week?.total_week_protein_pct || 0).toFixed(0)}
          %)
        </span>
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(week?.total_week_carbohydrate || 0).toFixed(0)}g{" "}
        <span className="text-sm font-normal text-gray-400">
          ({Number(week?.total_week_carbohydrate_pct | 0).toFixed(0)}
          %)
        </span>
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(week?.total_week_fat || 0).toFixed(0)}g{" "}
        <span className="text-sm font-normal text-gray-400">
          ({Number(week?.total_week_fat_pct || 0).toFixed(0)}%)
        </span>
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(week?.total_week_saturates || 0).toFixed(0)}g
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(week?.total_week_sugars || 0).toFixed(0)}g
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(week?.total_week_fibre || 0).toFixed(0)}g
      </div>
      <div className="border-b-[1px] bg-gray-100 p-2 text-end font-bold">
        {Number(week?.total_week_salt || 0).toFixed(1)}g
      </div>
      <div className="col-span-5 border-b-[1px] bg-gray-100 p-2 text-end font-bold"></div>
    </>
  );
}
