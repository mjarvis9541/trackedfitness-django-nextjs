import FormAPIError from "./FormAPIError";

export default function FormInput({
  accept,
  apiErrors,
  errors,
  autoFocus = false,
  autoComplete,
  defaultValue,
  id,
  label,
  register,
  required,
  step,
  type = "text",
}: {
  accept?: string;
  autoFocus?: any;
  apiErrors?: any;
  errors?: any;
  autoComplete?: boolean;
  defaultValue?: string;
  id: string;
  label?: string;
  register: any;
  required?: boolean;
  step?: number;
  type?: string;
}) {
  const twClassName =
    (apiErrors && apiErrors[register.name]) || errors
      ? `active:ring-red-500 block w-full rounded border border-red-500 bg-zinc-800 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 active:border-red-500 active:ring-2 active:ring-red-500`
      : `active:ring-blue-500 block w-full rounded border border-zinc-800 bg-zinc-800 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 active:border-blue-500 active:ring-2 active:ring-blue-500`;
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1 flex text-sm font-bold text-gray-200">
        {label ? label : <span className="capitalize">{id}</span>}
      </label>
      <input
        id={id}
        type={type}
        accept={accept}
        step={step}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        required={required}
        {...register}
        defaultValue={defaultValue}
        className={twClassName}
      />
      <FormAPIError status={apiErrors && apiErrors[id]} />
    </div>
  );
}
