import BrandListHeader from "./BrandListHeader";
import BrandListItem from "./BrandListItem";

const BrandListContainer = ({ isLoading, error, data }) => {
  return (
    <>
      <BrandListHeader />
      <BrandList isLoading={isLoading} error={error} data={data} />
    </>
  );
};

const BrandList = ({ isLoading, error, data }) => {
  if (isLoading) return <div className="col-span-3 p-2">Loading...</div>;
  if (error) return <div className="col-span-3 p-2">Error</div>;
  return (
    <>
      {data.results.map((brand) => (
        <BrandListItem key={brand.id} data={brand} />
      ))}
    </>
  );
};

export default BrandListContainer;
