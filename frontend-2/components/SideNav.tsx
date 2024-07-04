"use client";
import useShowMenu from "@/hooks/useShowMenu";
import Link from "next/link";
import {
  BiBook,
  BiBowlHot,
  BiCalendar,
  BiCog,
  BiCycling,
  BiDumbbell,
  BiFoodMenu,
  BiHelpCircle,
  BiLineChart,
  BiMenu,
} from "react-icons/bi";

export default function LowerSide({ username }) {
  const { ref, showMenu, setShowMenu } = useShowMenu(false);

  return (
    <div className="contents" ref={ref}>
      <div
        onClick={() => setShowMenu((prev) => !prev)}
        className="rounded bg-zinc-800 p-1.5 hover:cursor-pointer hover:bg-zinc-600"
      >
        <BiMenu size={20} />
      </div>
      <div
        className={`fixed left-0 right-0 top-12 h-full w-60 bg-zinc-800 font-normal text-white duration-300 ease-in-out ${
          showMenu ? "-translate-x-0 " : "-translate-x-full"
        }`}
      >
        <div className="ml-2 text-gray-100">
          <Link
            onClick={() => setShowMenu(false)}
            href={`/${username}/diet`}
            className="mr-2 mt-2 flex items-center gap-4 rounded p-2 hover:bg-zinc-600"
          >
            <BiCalendar size={20} /> Diet
          </Link>
          <Link
            onClick={() => setShowMenu(false)}
            href={`/${username}/diet-week`}
            className="mr-2 flex items-center gap-4 rounded p-2 hover:bg-zinc-600"
          >
            <BiBook size={20} /> Diet Week
          </Link>
          <Link
            onClick={() => setShowMenu(false)}
            href={`/${username}/diet-targets-date`}
            className="mr-2 mb-4 flex items-center gap-4 rounded p-2 hover:bg-zinc-600"
          >
            <BiLineChart size={20} /> Diet Targets Date
          </Link>
          <Link
            onClick={() => setShowMenu(false)}
            href={`/${username}/progress`}
            className="mr-2 mb-4 flex items-center gap-4 rounded p-2 hover:bg-zinc-600"
          >
            <BiLineChart size={20} /> Progress
          </Link>

          {/* Food */}
          <Link
            onClick={() => setShowMenu(false)}
            href="/food"
            className="mr-2 flex items-center gap-4 rounded p-2 hover:bg-zinc-600"
          >
            <BiBowlHot size={20} /> Food
          </Link>
          <Link
            onClick={() => setShowMenu(false)}
            href="/meals"
            className="mr-2 mb-4 flex items-center gap-4 rounded p-2 hover:bg-zinc-600"
          >
            <BiFoodMenu size={20} /> Meals
          </Link>

          {/* Training */}
          <Link
            onClick={() => setShowMenu(false)}
            href="/training-plans"
            className="mr-2 flex items-center gap-4 rounded p-2 hover:bg-zinc-600"
          >
            <BiDumbbell size={20} /> Training
          </Link>
          <Link
            onClick={() => setShowMenu(false)}
            href="/"
            className="mr-2 flex items-center gap-4 rounded p-2 hover:bg-zinc-600"
          >
            <BiBook size={20} /> Training Plans
          </Link>
          <Link
            onClick={() => setShowMenu(false)}
            href="/exercises"
            className="mr-2 mb-4 flex items-center gap-4 rounded p-2 hover:bg-zinc-600"
          >
            <BiCycling size={20} />
            Exercises
          </Link>

          {/* Account */}
          <Link
            onClick={() => setShowMenu(false)}
            href="/"
            className="mr-2 flex items-center gap-4 rounded p-2 hover:bg-zinc-600"
          >
            <BiCog size={20} /> Settings
          </Link>
          <Link
            onClick={() => setShowMenu(false)}
            href="/"
            className="mr-2 flex items-center gap-4 rounded p-2 hover:bg-zinc-600"
          >
            <BiHelpCircle size={20} /> Help
          </Link>
        </div>
      </div>
    </div>
  );
}
