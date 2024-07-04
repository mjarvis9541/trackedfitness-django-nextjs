import Link from "next/link";
import { BiSearch } from "react-icons/bi";
import LeftNav from "./LeftNav";
import RightNav from "./RightNav";

export default function Navbar() {
  return (
    <nav className="sticky top-0 flex items-center gap-2 p-2 font-bold">
      <LeftNav />
      <div className="flex flex-1 items-center justify-between">
        <div>
          <Link href="/">Trackedfitness</Link>
        </div>
        <div className="flex gap-2">
          <Link href="/michael/diet" className="p-1.5">
            Diet
          </Link>
          <Link href="/michael/diet" className="p-1.5">
            Diet Week
          </Link>
          <Link href="/michael/diet-week" className="p-1.5">
            Diet Week
          </Link>
          <Link href="/" className="rounded p-1.5">
            <BiSearch size={20} />
          </Link>
          <RightNav />
        </div>
      </div>
    </nav>
  );
}
