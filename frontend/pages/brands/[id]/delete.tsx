import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import useDeleteBrand from "../../../app/brands/useDeleteBrand";
import useGetBrand from "../../../app/brands/useGetBrand";
import FormAPIError from "../../../components/FormAPIError";

const BrandDelete = () => {
  const router = useRouter();
  const { id } = router.query;
  const [apiErrors, setApiErrors] = useState([]);
  const { isLoading, error, data } = useGetBrand({ id });
  const deleteMutation = useDeleteBrand({ id });

  const handleDelete = (data) => {
    deleteMutation.mutate(data, {
      onSuccess: (data) => {
        router.push(`/brands`);
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
        <title>Delete Brand - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Delete brand from the database" />
      </Head>

      <h1 className="text-2xl font-bold">Delete Brand</h1>

      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />

      <p>Are you sure you wish to delete this brand?</p>

      <h3>{data.name}</h3>

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

export default BrandDelete;
