import FormAPIError from "./FormAPIError";

export default function FormInput({
  accept,
  apiErrors,
  autoComplete = false,
  defaultValue,
  id,
  label,
  register,
  required,
  step,
  type = "text",
}: {
  accept?: string;
  apiErrors?: any;
  autoComplete?: boolean;
  defaultValue?: string;
  id: string;
  label?: string;
  register: any;
  required?: boolean;
  step?: number;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-bold">
        {label ? label : <span className="capitalize">{id}</span>}
      </label>
      <input
        id={id}
        type={type}
        accept={accept}
        step={step}
        autoComplete={autoComplete}
        required={required}
        {...register}
        defaultValue={defaultValue}
        className="mt-1 block w-full rounded border bg-transparent p-2 font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <FormAPIError status={apiErrors && apiErrors[id]} />
    </div>
  );
}
