"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({
  isLoading,
  error,
  data,
  page,
  setPage,
  maxPage,
}) {
  return (
    <nav className="flex items-center justify-between">
      <div className="flex items-center">
        Page {page} of {maxPage}
      </div>
      <div className="flex gap-3">
        <button
          className="rounded bg-gray-100 px-4 py-2 hover:bg-gray-300 disabled:bg-gray-300"
          disabled={page === 1}
          onClick={() => setPage(1)}
        >
          First Page
        </button>
        <button
          className="rounded bg-gray-100 px-4 py-2 hover:bg-gray-300 disabled:bg-gray-300"
          disabled={!data?.previous}
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
        >
          <FiChevronLeft size={18} />
        </button>
        <button
          className="rounded bg-gray-100 px-4 py-2 hover:bg-gray-300 disabled:bg-gray-300"
          disabled={!data?.next}
          onClick={() =>
            setPage((old) => (!data || !data.next ? old : Number(old) + 1))
          }
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </nav>
  );
}
