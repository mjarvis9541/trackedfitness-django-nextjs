import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import useDeleteFood from "../../../app/food/useDeleteFood";
import useGetFood from "../../../app/food/useGetFood";
import FormAPIError from "../../../components/FormAPIError";

const FoodDelete = () => {
  const router = useRouter();
  const { id } = router.query;
  const [apiErrors, setApiErrors] = useState([]);
  const { isLoading, error, data } = useGetFood({ id });
  const deleteMutation = useDeleteFood({ id });

  const handleDelete = (data) => {
    deleteMutation.mutate(data, {
      onSuccess: (data) => {
        router.push(`/food`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Delete Food - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Delete food from the database" />
      </Head>

      <h1 className="text-xl font-bold">Delete Food</h1>

      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />

      <p>Are you sure you wish to delete this food?</p>

      <h3>
        {data.name}, {data.brand_name}, {data.data_value}
        {data.data_measurement}
      </h3>

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

export default FoodDelete;
