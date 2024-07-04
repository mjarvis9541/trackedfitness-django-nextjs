"use client";

import Link from "next/link";
import {
  BiBook,
  BiCalculator,
  BiCog,
  BiCycling,
  BiDumbbell,
  BiFoodMenu,
  BiFridge,
  BiHelpCircle,
  BiLineChart,
  BiMenu,
  BiSpreadsheet,
  BiUser,
} from "react-icons/bi";
import useShowMenu from "./useShowMenu";

export default function LowerSide() {
  const { ref, showMenu, setShowMenu } = useShowMenu(false);

  return (
    <div className="contents" ref={ref}>
      <div
        onClick={() => setShowMenu((prev) => !prev)}
        className="rounded p-1.5 hover:cursor-pointer"
      >
        <BiMenu size={20} />
      </div>

      <div
        className={`fixed left-0 right-0 top-12 h-full w-60 rounded-r border-r-[1px] border-t-[1px] font-normal duration-300 ease-in-out ${
          showMenu ? "-translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="m-2">
          <div className="mb-2 border-b-[1px]  pb-2">
            <Link
              onClick={() => setShowMenu(false)}
              href="/michael/diet"
              className="flex items-center gap-4 rounded p-2"
            >
              <BiSpreadsheet size={20} /> Diet
            </Link>
            <Link
              onClick={() => setShowMenu(false)}
              href="/michael/diet-week"
              className="flex items-center gap-4 rounded p-2"
            >
              <BiSpreadsheet size={20} /> Diet Week
            </Link>
            <Link
              onClick={() => setShowMenu(false)}
              href="/michael/diet-targets-date"
              className="flex items-center gap-4 rounded p-2"
            >
              <BiBook size={20} /> Diet Targets
            </Link>
            <Link
              onClick={() => setShowMenu(false)}
              href="/michael/diet-targets"
              className="flex items-center gap-4 rounded p-2"
            >
              <BiCalculator size={20} /> Diet Targets
            </Link>
          </div>

          {/* Food */}
          <div className="mb-2 border-b-[1px]  pb-2">
            <Link
              onClick={() => setShowMenu(false)}
              href="/food"
              className="mr-2 flex items-center gap-4 rounded p-2"
            >
              <BiFoodMenu size={20} /> Food
            </Link>
            <Link
              onClick={() => setShowMenu(false)}
              href="/brands"
              className="mr-2 flex items-center gap-4 rounded p-2"
            >
              <BiFoodMenu size={20} /> Brands
            </Link>

            <Link
              onClick={() => setShowMenu(false)}
              href="/meals"
              className="flex items-center gap-4 rounded p-2"
            >
              <BiFridge size={20} /> Meals
            </Link>
          </div>

          <div className="mb-2 border-b-[1px]  pb-2">
            {/* Training */}
            <Link
              onClick={() => setShowMenu(false)}
              href="/training"
              className="mr-2 flex items-center gap-4 rounded p-2"
            >
              <BiSpreadsheet size={20} /> Training
            </Link>
            <Link
              onClick={() => setShowMenu(false)}
              href="/training"
              className="mr-2 flex items-center gap-4 rounded p-2"
            >
              <BiDumbbell size={20} /> Training Plans
            </Link>
            <Link
              onClick={() => setShowMenu(false)}
              href="/exercises"
              className="flex items-center gap-4 rounded p-2"
            >
              <BiCycling size={20} />
              Exercises
            </Link>
          </div>
          <div className="mb-2 border-b-[1px]  pb-2">
            {/* Progress */}
            <Link
              onClick={() => setShowMenu(false)}
              href="/michael/progress"
              className="flex items-center gap-4 rounded p-2"
            >
              <BiLineChart size={20} />
              Progress
            </Link>
          </div>

          {/* Account */}
          <Link
            onClick={() => setShowMenu(false)}
            href="/users"
            className="flex items-center gap-4 rounded p-2"
          >
            <BiUser size={20} /> Users
          </Link>
          <Link
            onClick={() => setShowMenu(false)}
            href="/"
            className="flex items-center gap-4 rounded p-2"
          >
            <BiCog size={20} /> Settings
          </Link>
          <Link
            onClick={() => setShowMenu(false)}
            href="/"
            className="flex items-center gap-4 rounded p-2"
          >
            <BiHelpCircle size={20} /> Help
          </Link>
        </div>
      </div>
    </div>
  );
}
