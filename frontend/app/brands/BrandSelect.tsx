"use client";

const BrandSelect = ({
  brandIsLoading,
  brandError,
  brandData,
  brand,
  setBrand,
}) => {
  if (brandIsLoading)
    return (
      <select className="w-full rounded border bg-white py-2 px-3 focus:outline-none focus:ring focus:ring-blue-400">
        <option>Loading...</option>
      </select>
    );

  if (brandError)
    return (
      <select className="w-full rounded border bg-white py-2 px-3 focus:outline-none focus:ring focus:ring-blue-400">
        <option>Error</option>
      </select>
    );

  const defaultOption = [{ id: "", name_with_count: "Brand" }];
  return (
    <select
      className="w-full rounded border bg-white py-2 px-3 focus:outline-none focus:ring focus:ring-blue-400"
      value={brand}
      onChange={(e) => setBrand(e.target.value)}
    >
      {defaultOption.concat(brandData).map((option) => (
        <option key={option.id} value={option.id}>
          {option.name_with_count}
        </option>
      ))}
    </select>
  );
};

export default BrandSelect;
