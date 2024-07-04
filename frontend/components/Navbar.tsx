"use client";
import Link from "next/link";
import { useState } from "react";
import { useUserContext } from "../contexts/UserContext";

export default function Navbar() {
  const { user } = useUserContext();
  const [navbar, setNavbar] = useState(false);

  return (
    <nav className="w-full bg-gray-800 shadow">
      <div className="mx-auto justify-between px-4 md:flex md:items-center md:px-8">
        <div>
          <div className="flex items-center justify-between py-1 md:block md:py-3">
            <Link href="/" className="text-xl font-bold text-white">
              Trackedfitness
            </Link>
            <div className="md:hidden">
              <button
                className="rounded-md p-2 text-gray-700 outline-none focus:border focus:border-gray-400"
                onClick={() => setNavbar((navbar) => !navbar)}
              >
                {navbar ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`mt-4 flex-1 justify-self-center pb-3 md:mt-0 md:block md:pb-0 ${
              navbar ? "block" : "hidden"
            }`}
          >
            <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
              <li className="text-white">
                <Link href="/food" onClick={() => setNavbar(false)}>
                  Food
                </Link>
              </li>
              <li className="text-white">
                <Link href="/brands" onClick={() => setNavbar(false)}>
                  Brands
                </Link>
              </li>
              <li className="text-white">
                <Link href="/meals" onClick={() => setNavbar(false)}>
                  Meals
                </Link>
              </li>
              {user?.access ? (
                <>
                  <li className="text-white">
                    <Link
                      href={`/${user?.username}/diet`}
                      onClick={() => setNavbar(false)}
                    >
                      Diet
                    </Link>
                  </li>
                  <li className="text-white">
                    <Link
                      href={`/${user?.username}/diet-week`}
                      onClick={() => setNavbar(false)}
                    >
                      Diet Week
                    </Link>
                  </li>
                  <li className="text-white">
                    <Link
                      href={`/${user?.username}/diet-month`}
                      onClick={() => setNavbar(false)}
                    >
                      Diet Month
                    </Link>
                  </li>
                  <li className="text-white">
                    <Link
                      href={`/${user?.username}/target-month`}
                      onClick={() => setNavbar(false)}
                    >
                      Targets
                    </Link>
                  </li>
                  <li className="text-white">
                    <Link
                      href={`/${user?.username}/progress-month`}
                      onClick={() => setNavbar(false)}
                    >
                      Progress
                    </Link>
                  </li>
                  <li className="text-white">
                    <Link href={`/profile`} onClick={() => setNavbar(false)}>
                      New Profile
                    </Link>
                  </li>
                  <li className="text-white">
                    <Link
                      href={`/diet-targets`}
                      onClick={() => setNavbar(false)}
                    >
                      New Targets
                    </Link>
                  </li>
                  <li className="text-white">
                    <Link
                      href={`/${user?.username}`}
                      onClick={() => setNavbar(false)}
                      className="capitalize"
                    >
                      {user?.username}
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="text-white">
                    <Link href="/login" onClick={() => setNavbar(false)}>
                      Log in
                    </Link>
                  </li>
                  <li className="text-white">
                    <Link href="/signup" onClick={() => setNavbar(false)}>
                      Sign up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
