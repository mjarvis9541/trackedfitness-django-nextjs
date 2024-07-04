import BrandListItem from "./BrandListItem";

export default function BrandList({
  brands,
}: {
  brands: { results: Brand[] };
}) {
  return (
    <div className="grid grid-cols-[10fr_repeat(3,_minmax(0,_auto))]">
      <div className="border-b-[1px] p-2 font-bold">Brand</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Food</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Created</div>
      <div className="border-b-[1px] p-2 text-end font-bold">Updated</div>
      {brands.results.map((brand: Brand) => (
        <BrandListItem key={brand.id} brand={brand} />
      ))}
    </div>
  );
}
