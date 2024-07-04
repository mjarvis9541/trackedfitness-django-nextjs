import useGEtMealListSelect from "./useGetMealListSelect";

const MealSelectForm = ({ register }) => {
  const { isLoading, error, data } = useGEtMealListSelect();
  if (isLoading)
    return (
      <select className="w-full rounded border bg-transparent p-2">
        <option>Loading...</option>
      </select>
    );

  if (error)
    return (
      <select className="w-full rounded border bg-transparent p-2">
        <option>Error</option>
      </select>
    );

  const defaultOption = [{ id: "", name: "---------" }];
  return (
    <select
      className="w-full rounded border bg-transparent p-2"
      id="saved_meal"
      {...register("meal")}
    >
      {defaultOption.concat(data).map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default MealSelectForm;
