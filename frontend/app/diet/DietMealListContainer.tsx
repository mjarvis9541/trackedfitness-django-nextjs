import DietListFooter from "./DietListFooter";
import DietListHeader from "./DietListHeader";
import DietListItem from "./DietListItem";

const DietMealListContainer = ({
  isLoading,
  error,
  data,
  username,
  date,
  meal,
  isCheck,
  setIsCheck,
  handleCheck,
}) => {
  return (
    <>
      <DietListHeader
        data={data}
        meal={meal}
        isCheck={isCheck}
        setIsCheck={setIsCheck}
      />
      <DietMealList
        isLoading={isLoading}
        error={error}
        data={data}
        username={username}
        date={date}
        meal={meal}
        isCheck={isCheck}
        handleCheck={handleCheck}
      />
      <DietListFooter data={data} username={username} date={date} meal={meal} />
    </>
  );
};

const DietMealList = ({
  isLoading,
  error,
  data,
  username,
  date,
  meal,
  isCheck,
  handleCheck,
}) => {
  if (isLoading) return <div className="col-span-11 p-2">Loading...</div>;
  if (error) return <div className="col-span-11 p-2">Error</div>;
  const mealData = data.filter((diet) => diet.meal === meal.order);

  return (
    <>
      {mealData.map((food) => (
        <DietListItem
          key={food.id}
          data={food}
          username={username}
          date={date}
          meal={meal}
          isCheck={isCheck}
          handleCheck={handleCheck}
        />
      ))}
    </>
  );
};

export default DietMealListContainer;
