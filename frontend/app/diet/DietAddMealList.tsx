import DietAddMealListHeader from "./DietAddMealListHeader";
import DietAddMealListItem from "./DietAddMealListItem";

const DietAddMealListContainer = ({
  isCheck,
  isCheckAll,
  handleCheck,
  handleCheckAll,
  isLoading,
  error,
  data,
  handleAdd,
  createMutation,
}) => {
  return (
    <>
      <DietAddMealListHeader />
      <DietAddMealList
        isCheck={isCheck}
        handleCheck={handleCheck}
        isLoading={isLoading}
        error={error}
        data={data}
        handleAdd={handleAdd}
        createMutation={createMutation}
      />
    </>
  );
};

const DietAddMealList = ({
  isLoading,
  error,
  data,
  handleAdd,
  createMutation,
}) => {
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <>
      {data.results.map((food) => (
        <DietAddMealListItem
          key={food.id}
          data={food}
          handleAdd={handleAdd}
          createMutation={createMutation}
        />
      ))}
    </>
  );
};

export default DietAddMealListContainer;
