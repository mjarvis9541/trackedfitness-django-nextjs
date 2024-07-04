import MealListHeader from "./MealListHeader";
import MealListItem from "./MealListItem";

const MealListContainer = ({ isLoading, error, data }) => {
  return (
    <>
      <MealListHeader />
      <MealList isLoading={isLoading} error={error} data={data} />
    </>
  );
};

const MealList = ({ isLoading, error, data }) => {
  if (isLoading) return <div className="col-span-12">Loading...</div>;
  if (error) return <div className="col-span-12">Error</div>;
  return (
    <>
      {data.results.map((food) => (
        <MealListItem key={food.id} data={food} />
      ))}
    </>
  );
};

export default MealListContainer;
