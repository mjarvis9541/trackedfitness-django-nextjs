import Head from "next/head";
import { useRouter } from "next/router";
import MealForm from "../../../app/meals/MealForm";
import useGetMeal from "../../../app/meals/useGetMeal";

const MealUpdate = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, error, data } = useGetMeal({ id });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Rename Meal - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Rename meal" />
      </Head>

      <h1 className="text-2xl font-bold">Rename Meal</h1>

      <MealForm data={data} />
    </div>
  );
};

export default MealUpdate;
