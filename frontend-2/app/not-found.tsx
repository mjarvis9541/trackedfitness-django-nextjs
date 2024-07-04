import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-4 md:p-3">
      <h1 className="mb-4 text-2xl font-bold">404 Page Not Found</h1>
      <p className="mb-4">Could not find the requested resource.</p>
      <p>
        <Link href="/" className="text-blue-500 hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}
