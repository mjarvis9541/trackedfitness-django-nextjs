import FormAPIError from "./FormAPIError";

export default function FormSelect({
  apiErrors,
  id,
  label,
  defaultValue = "",
  defaultDisplay = "---------",
  options,
  register,
  required,
}: {
  apiErrors?: any;
  id: string;
  label?: string;
  defaultValue?: string;
  defaultDisplay?: string;
  options: any;
  register: any;
  required?: string;
}) {
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
        required={required || true}
        className="flex w-full rounded border border-zinc-800 bg-zinc-800 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 active:border-blue-500 active:ring-2 active:ring-blue-500"
        f
        {...register}
      >
        {defaultOption.concat(options).map((option) => (
          <option key={option.value} value={option.value}>
            {option.display}
          </option>
        ))}
      </select>
      <FormAPIError status={apiErrors && apiErrors[id]} />
    </div>
  );
}
