import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import useDeleteMealItem from "../../../../app/meals/useDeleteMealItem";
import useGetMeal from "../../../../app/meals/useGetMeal";
import useGetMealItem from "../../../../app/meals/useGetMealItem";
import FormAPIError from "../../../../components/FormAPIError";

const MealItemDeletePage = () => {
  const router = useRouter();
  const { id, itemId } = router.query;
  const [apiErrors, setApiErrors] = useState([]);

  const { isLoading, error, data } = useGetMeal({ id });

  const {
    isLoading: mealItemIsLoading,
    error: mealItemError,
    data: mealItemData,
  } = useGetMealItem({ itemId });

  const deleteMutation = useDeleteMealItem({ itemId });
  const handleDelete = (data) => {
    deleteMutation.mutate(data, {
      onSuccess: (data) => {
        router.push(`/meals`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  if (isLoading || mealItemIsLoading) return <div>Loading...</div>;
  if (error || mealItemError) return <div>Error</div>;

  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Delete Saved Meal Item - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Delete saved meal item from the database"
        />
      </Head>

      <h1 className="text-xl font-bold">Delete Meal Item</h1>

      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />

      <p>Are you sure you wish to delete this saved meal item?</p>

      <p>This action cannot be undone.</p>

      <button
        className="rounded bg-red-600 py-2 px-4 text-white hover:bg-red-700"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default MealItemDeletePage;
