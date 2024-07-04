"use client";

import Link from "next/link";
import { BiLock, BiLogIn, BiLogOut, BiUser } from "react-icons/bi";
import useShowMenu from "./useShowMenu";

export default function AccountDropDown() {
  const { ref, showMenu, setShowMenu } = useShowMenu(false);

  return (
    <div className="contents" ref={ref}>
      <div
        onClick={() => setShowMenu((prev) => !prev)}
        className="rounded p-1.5 hover:cursor-pointer"
      >
        <BiUser size={20} />
      </div>
      <div
        className={`fixed top-0 right-0 w-48 rounded border duration-300 ease-in-out ${
          showMenu ? "translate-y-12" : "hidden"
        }`}
      >
        <div className="m-2 block rounded font-normal">
          <Link
            onClick={() => setShowMenu(false)}
            href="/profile"
            className="flex items-center gap-4 rounded p-2"
          >
            <BiUser size={20} />
            Profile
          </Link>
          <Link
            onClick={() => setShowMenu(false)}
            href="/profile"
            className="flex items-center gap-4 rounded p-2"
          >
            <BiLock size={20} /> My account
          </Link>

          <Link
            onClick={() => setShowMenu(false)}
            href="/signup"
            className="flex items-center gap-4 rounded p-2"
          >
            <BiLogIn size={20} /> Sign up
          </Link>
          <Link
            onClick={() => setShowMenu(false)}
            href="/login"
            className="flex items-center gap-4 rounded p-2"
          >
            <BiLogIn size={20} /> Log in
          </Link>
          <Link
            onClick={() => setShowMenu(false)}
            href="/logout"
            className="flex items-center gap-4 rounded p-2"
          >
            <BiLogOut size={20} /> Log out
          </Link>
        </div>
      </div>
    </div>
  );
}
