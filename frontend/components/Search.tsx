"use client";

export default function Search({ search, setSearch, setPage }) {
  return (
    <form>
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search"
        className="w-full rounded border py-2 px-3 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
    </form>
  );
}
