export default function Select({ id, options, register }) {
  return (
    <select
      id={id}
      className="mt-1 w-full rounded border bg-transparent p-2"
      {...register}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.display}
        </option>
      ))}
    </select>
  );
}
