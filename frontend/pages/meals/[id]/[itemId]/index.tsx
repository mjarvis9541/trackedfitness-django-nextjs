import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import FoodDetailTable from "../../../../app/food/FoodDetailTable";
import useGetMeal from "../../../../app/meals/useGetMeal";
import useGetMealItem from "../../../../app/meals/useGetMealItem";

const MealItemDetailUpdateDelete = () => {
  const router = useRouter();
  const { id, itemId } = router.query;
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
        <title>Meal Item - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1 className="text-xl font-bold">Meal Item</h1>

      <div>
        Meal:{" "}
        <Link href={`/meals/${mealItemData.meal}`} className="hover:underline">
          {data.name}
        </Link>
      </div>

      <p>
        Meal Item: {mealItemData.food_name}, {mealItemData.brand_name},{" "}
        {mealItemData.data_value}
        {mealItemData.data_measurement}
      </p>

      <div>
        Created by:{" "}
        <Link href={`/${data.username}`} className="hover:underline">
          {data.username}
        </Link>
      </div>
      <FoodDetailTable data={mealItemData} state={{ hello: "world" }} />

      <div>
        <Link
          href={`/meals/${id}/${itemId}/update`}
          className="hover:underline"
        >
          Edit
        </Link>
      </div>

      <div>
        <Link
          href={`/meals/${id}/${itemId}/delete`}
          className="hover:underline"
        >
          Delete
        </Link>
      </div>
    </div>
  );
};

export default MealItemDetailUpdateDelete;
