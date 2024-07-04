import Link from "next/link";
import { BiDuplicate, BiEdit, BiMinus } from "react-icons/bi";

export default function DietMealHeader() {
  return (
    <div className="mb-1.5 flex items-center justify-between">
      <h2 className="font-bold">Breakfast</h2>
      <div className="flex gap-1.5">
        <Link href="/diet/add-food" className="rounded bg-zinc-600 p-1.5">
          <BiEdit size={20} />
        </Link>
        <Link href="/diet/add-meal" className="rounded bg-zinc-600 p-1.5">
          <BiDuplicate size={20} />
        </Link>
        <div className="rounded bg-zinc-600 p-1.5">
          <BiMinus size={20} />
        </div>
      </div>
    </div>
  );
}
