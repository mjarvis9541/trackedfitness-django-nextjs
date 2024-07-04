"use client";

import useDebouncer from "@/hooks/useDebouncer";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Search({
  id,
  label,
  path,
  autoFocus = false,
  placeholder,
}: {
  id: string;
  label?: string;
  path: string;
  autoFocus?: any;
  placeholder?: string;
}) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");
  const router = useRouter();
  const [search, setSearch] = useState<string>(searchQuery || "");

  useDebouncer(() => router.push(`/${path}/?search=${search}`), 250, [search]);

  return (
    <div>
      <label htmlFor={id} className="mb-1 flex text-sm font-bold text-gray-200">
        {label ? label : <span className="capitalize">{id}</span>}
      </label>
      <input
        id={id}
        autoComplete="off"
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="search"
        className="flex w-full rounded border border-zinc-800 bg-zinc-800 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 active:border-blue-500 active:ring-2 active:ring-blue-500"
      />
    </div>
  );
}
