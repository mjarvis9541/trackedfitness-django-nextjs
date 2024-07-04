"use client";

import Link from "next/link";

export default function DietListTarget({
  targetIsLoading,
  targetError,
  targetData,
  dayTargetIsLoading,
  dayTargetError,
  dayTargetData,
}) {
  if (targetIsLoading || dayTargetIsLoading)
    return (
      <div className="col-span-4 bg-gray-100 p-2 font-bold md:col-span-11">
        Loading...
      </div>
    );
  if (targetError && dayTargetError)
    return (
      <div className="col-span-4 bg-gray-100 p-2 font-bold md:col-span-11">
        Error
      </div>
    );

  if (dayTargetData) {
    return (
      <>
        <Link
          className="col-span-4 flex bg-gray-100 p-2 font-bold md:col-span-3"
          href="/targets"
        >
          Target
        </Link>
        <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
          {dayTargetData.energy}kcal
        </div>
        <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
          {dayTargetData.protein}g{" "}
          {/* <span className="ml-1 text-sm text-gray-400">
            ({Number(targetData.percent_protein).toFixed(0)}%)
          </span> */}
        </div>
        <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
          {dayTargetData.carbohydrate}g
          {/* <span className="ml-1 text-sm text-gray-400">
            ({Number(targetData.percent_carbohydrate).toFixed(0)}%)
          </span> */}
        </div>
        <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
          {dayTargetData.fat}g
          {/* <span className="ml-1 text-sm text-gray-400">
            ({Number(targetData.percent_fat).toFixed(0)}%)
          </span> */}
        </div>
        <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:flex">
          {dayTargetData.saturates}g
        </div>
        <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:flex">
          {dayTargetData.sugars}g
        </div>
        <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:flex">
          {dayTargetData.fibre}g
        </div>
        <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:flex">
          {dayTargetData.salt}g
        </div>
      </>
    );
  } else {
    return (
      <>
        <Link
          className="col-span-4 flex bg-gray-100 p-2 font-bold md:col-span-3"
          href="/targets"
        >
          Target
        </Link>
        <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
          {targetData.energy}kcal
        </div>
        <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
          {targetData.protein}g
          {/* <span className="ml-1 text-sm text-gray-400">
            ({Number(targetData.percent_protein).toFixed(0)}%)
          </span> */}
        </div>
        <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
          {targetData.carbohydrate}g
          {/* <span className="ml-1 text-sm text-gray-400">
            ({Number(targetData.percent_carbohydrate).toFixed(0)}%)
          </span> */}
        </div>
        <div className="flex items-center justify-end bg-gray-100 p-2 font-bold">
          {targetData.fat}g
          {/* <span className="ml-1 text-sm text-gray-400">
            ({Number(targetData.percent_fat).toFixed(0)}%)
          </span> */}
        </div>
        <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:flex">
          {targetData.saturates}g
        </div>
        <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:flex">
          {targetData.sugars}g
        </div>
        <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:flex">
          {targetData.fibre}g
        </div>
        <div className="hidden items-center justify-end bg-gray-100 p-2 font-bold md:flex">
          {targetData.salt}g
        </div>
      </>
    );
  }
}
