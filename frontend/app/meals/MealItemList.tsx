import MealItemListFooter from "./MealItemListFooter";
import MealItemListHeader from "./MealItemListHeader";
import MealItemListItem from "./MealItemListItem";

const MealItemListContainer = ({
  isLoading,
  error,
  data,
  isCheck,
  handleCheck,
  isCheckAll,
  handleCheckAll,
}) => {
  return (
    <>
      <MealItemListHeader
        isCheckAll={isCheckAll}
        handleCheckAll={handleCheckAll}
      />
      <MealItemList
        isCheck={isCheck}
        handleCheck={handleCheck}
        isLoading={isLoading}
        error={error}
        data={data}
      />
      <MealItemListFooter isLoading={isLoading} error={error} data={data} />
    </>
  );
};

const MealItemList = ({ isLoading, error, data, isCheck, handleCheck }) => {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  return (
    <>
      {data.items.map((food) => (
        <MealItemListItem
          mealId={data.id}
          key={food.id}
          data={food}
          isCheck={isCheck}
          handleCheck={handleCheck}
        />
      ))}
    </>
  );
};
export default MealItemListContainer;
