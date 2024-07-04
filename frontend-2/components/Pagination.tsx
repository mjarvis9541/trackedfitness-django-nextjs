import Link from "next/link";

export default function Pagination({
  path,
  page,
  data,
}: {
  path: string;
  page: string;
  data: { next: string; previous: string; count: string; results: any[] };
}) {
  return (
    <div className="my-4 flex items-center justify-between">
      <div>
        Showing {data?.results?.length} of {data.count}
      </div>
      <div className="flex items-stretch gap-2">
        <div className="mr-4">
          Page {page} of {Math.ceil(Number(data.count) / 25)}
        </div>
        <Link
          href={`/${path}`}
          className={
            data.previous
              ? `flex rounded  bg-blue-500 px-4 py-1.5 text-white hover:bg-blue-600`
              : `pointer-events-none flex rounded bg-blue-500 px-4 py-1.5 text-white opacity-50`
          }
        >
          First Page
        </Link>
        <Link
          href={`/${path}?page=${Number(page) - 1}`}
          className={
            data.previous
              ? `flex rounded bg-blue-500 px-4 py-1.5 text-white hover:bg-blue-600`
              : `f flex rounded bg-blue-500 px-4 py-1.5 text-white opacity-50`
          }
        >
          <Previous />
        </Link>
        <Link
          href={`/${path}/?page=${Number(page) + 1}`}
          className={
            data.next
              ? `flex rounded bg-blue-500 px-4 py-1.5 text-white hover:bg-blue-600`
              : `pointer-events-none flex rounded bg-blue-500 px-4 py-1.5 text-white opacity-50`
          }
        >
          <Next />
        </Link>
      </div>
    </div>
  );
}

const Previous = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffffff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H6M12 5l-7 7 7 7" />
  </svg>
);

const Next = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ffffff"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h13M12 5l7 7-7 7" />
  </svg>
);
