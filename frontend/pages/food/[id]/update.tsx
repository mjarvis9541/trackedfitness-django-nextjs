import Head from "next/head";
import { useRouter } from "next/router";
import FoodForm from "../../../app/food/FoodForm";
import useGetFood from "../../../app/food/useGetFood";

const FoodUpdate = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, error, data } = useGetFood({ id });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Edit Food - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Edit brand" />
      </Head>

      <h1 className="text-2xl font-bold">Edit Food</h1>

      <FoodForm data={data} />
    </div>
  );
};

export default FoodUpdate;
