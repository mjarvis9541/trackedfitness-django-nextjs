import DietMealListFooter from "./DietMealListFooter";
import DietMealListHeader from "./DietMealListHeader";
import DietMealListItem from "./DietMealListItem";

const DietMealDetailContainer = ({ isLoading, error, data }) => {
  return (
    <>
      <DietMealListHeader />
      <DietMealDetail isLoading={isLoading} error={error} data={data} />
      <DietMealListFooter isLoading={isLoading} error={error} data={data} />
    </>
  );
};

const DietMealDetail = ({ isLoading, error, data }) => {
  if (isLoading)
    return <div className="col-span-10 border-b-[1px] p-2">Loading...</div>;
  if (error) return <div className="col-span-10 border-b-[1px] p-2">Error</div>;
  if (!data.length)
    return (
      <div className="col-span-10 border-b-[1px] p-2">No diet entries.</div>
    );

  return (
    <>
      {data.map((data) => (
        <DietMealListItem key={data.id} data={data} />
      ))}
    </>
  );
};

export default DietMealDetailContainer;
