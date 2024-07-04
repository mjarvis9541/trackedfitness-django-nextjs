"use client";

import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const protectedRoutes = [
  "/",
  "/login",
  "/settings/password-reset-email-sent",
  "/settings/password-reset",
  "/settings/resend-activation-email",
  "/settings/signup-email-sent",
  "/signup",
];

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const { user, loading } = useContext(UserContext);

  // changed to unprotected routes, by default all routes are protected
  const loginRequired =
    protectedRoutes.includes(router.pathname) ||
    router.pathname.includes("/settings/activate-account");

  // Return page if user is logged in
  if (user?.access) return children;

  // Redirect user if anonymous
  if (
    typeof window !== "undefined" &&
    !loginRequired &&
    !loading &&
    !user?.access
  )
    router.push("/login");

  // Prevent page from flashing when loading
  if (!user?.access && !loginRequired)
    return (
      <div className="p-2">
        <h1>Loading...</h1>
      </div>
    );

  return children;
}
