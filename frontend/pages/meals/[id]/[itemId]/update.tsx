import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import MealItemForm from "../../../../app/meals/MealItemForm";
import useGetMeal from "../../../../app/meals/useGetMeal";
import useGetMealItem from "../../../../app/meals/useGetMealItem";

const MealItemUpdate = () => {
  const router = useRouter();
  const { id, itemId } = router.query;
  const [apiErrors, setApiErrors] = useState([]);

  const { isLoading, error, data } = useGetMeal({ id });
  const {
    isLoading: mealItemIsLoading,
    error: mealItemError,
    data: mealItemData,
  } = useGetMealItem({ itemId });

  if (isLoading || mealItemIsLoading) return <div> Loading...</div>;
  if (error || mealItemError) return <div>Error</div>;

  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Update Meal Item - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1 className="text-xl font-bold">Update Meal Item</h1>

      <h3 className="">Meal: {data.name}</h3>
      <p className="">
        Meal Item: {mealItemData.food_name}, {mealItemData.brand_name},{" "}
        {mealItemData.data_value}
        {mealItemData.data_measurement}
      </p>

      <MealItemForm data={mealItemData} />
    </div>
  );
};

export default MealItemUpdate;
