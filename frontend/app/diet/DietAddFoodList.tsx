import DietAddFoodListHeader from "./DietAddFoodListHeader";
import DietAddFoodListItem from "./DietAddFoodListItem";

const DietAddFoodListContainer = ({
  username,
  date,
  meal,
  data,
  onSubmit,
  createDiet,
}) => {
  return (
    <>
      <DietAddFoodListHeader />
      {data?.results.map((data) => (
        <DietAddFoodListItem
          key={data.id}
          username={username}
          date={date}
          meal={meal}
          data={data}
          onSubmit={onSubmit}
          createDiet={createDiet}
        />
      ))}
    </>
  );
};

export default DietAddFoodListContainer;
