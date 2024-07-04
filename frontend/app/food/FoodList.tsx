import FoodListHeader from "./FoodListHeader";
import FoodListItem from "./FoodListItem";

const FoodListContainer = ({
  isLoading,
  error,
  data,
  isCheck,
  isCheckAll,
  handleCheck,
  handleCheckAll,
}) => {
  return (
    <>
      <FoodListHeader isCheckAll={isCheckAll} handleCheckAll={handleCheckAll} />
      <FoodList
        isCheck={isCheck}
        handleCheck={handleCheck}
        isLoading={isLoading}
        error={error}
        data={data}
      />
    </>
  );
};

const FoodList = ({ isLoading, error, data, isCheck, handleCheck }) => {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  return (
    <>
      {data.results.map((food) => (
        <FoodListItem
          key={food.id}
          data={food}
          isCheck={isCheck}
          handleCheck={handleCheck}
        />
      ))}
    </>
  );
};

export default FoodListContainer;
