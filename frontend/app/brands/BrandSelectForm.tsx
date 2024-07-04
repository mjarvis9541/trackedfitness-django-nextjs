"use client";

const BrandSelectForm = ({
  brandIsLoading,
  brandError,
  brandData,
  id,
  register,
  defaultValue,
}) => {
  if (brandIsLoading)
    return (
      <select className="mt-1 w-full rounded border bg-transparent p-2">
        <option>Loading...</option>
      </select>
    );

  if (brandError)
    return (
      <select className="mt-1 w-full rounded border bg-transparent p-2">
        <option>Error</option>
      </select>
    );

  const defaultOption = [{ id: "", name: "---------" }];
  return (
    <select
      className="mt-1 w-full rounded border bg-transparent p-2"
      id={id}
      {...register("brand")}
      value={defaultValue}
    >
      {defaultOption.concat(brandData).map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default BrandSelectForm;
