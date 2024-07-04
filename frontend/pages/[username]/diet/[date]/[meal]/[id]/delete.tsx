import { formatISO } from "date-fns";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import useDeleteDiet from "../../../../../../app/diet/useDeleteDiet";
import useGetDiet from "../../../../../../app/diet/useGetDiet";
import { formatLongDate } from "../../../../../../utils/format-date";

const DietDelete = () => {
  const [apiErrors, setApiErrors] = useState([]);
  const router = useRouter();
  const {
    username,
    date = formatISO(new Date(), { representation: "date" }),
    meal,
    id,
  } = router.query;
  const { isLoading, error, data } = useGetDiet({ id });
  const deleteMutation = useDeleteDiet({ id });

  const handleDelete = (data) => {
    deleteMutation.mutate(data, {
      onSuccess: (data) => {
        router.push(`/${username}/diet/${date}`);
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
        <title>Delete Diet Entry - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Delete diet  from the database" />
      </Head>

      <h1 className="text-xl font-bold">Delete Diet</h1>

      <p className="text-xl font-bold">
        Meal {meal}, {formatLongDate(new Date(date))}
      </p>

      <div>
        <Link href={`/food/${data?.food_id}/`}>{data.food_name}</Link>
      </div>
      <div>
        <Link href={`/brands/${data?.brand_id}/`}>{data.brand_name}</Link>
      </div>

      <p>Are you sure you wish to delete this diet entry?</p>

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

export default DietDelete;
