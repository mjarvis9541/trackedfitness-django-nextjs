"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Filter({
  id,
  label,
  defaultValue = "",
  defaultDisplay = "---------",
  options,
  path,
  filter,
}: {
  id: string;
  label?: string;
  defaultValue?: string;
  defaultDisplay?: string;
  defaultOption?: Array<{ value: string; display: string }>;
  options: Array<{ value: string; display: string }>;
  path: string;
  filter: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();

  const handleChange = (e: string) => {
    router.push(`/${path}/?${filter}=${e}`);
  };

  const defaultOption = [
    { value: `${defaultValue}`, display: `${defaultDisplay}` },
  ];

  return (
    <div>
      <label htmlFor={id} className="mb-1 flex text-sm font-bold text-gray-200">
        {label ? label : <span className="capitalize">{id}</span>}
      </label>
      <select
        id={id}
        onChange={(e) => handleChange(e.target.value)}
        className="flex w-full rounded border border-zinc-800 bg-zinc-800 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 active:border-blue-500 active:ring-2 active:ring-blue-500"
      >
        {defaultOption.concat(options).map((option) => (
          <option key={option.value} value={option.value}>
            {option.display}
          </option>
        ))}
      </select>
    </div>
  );
}
