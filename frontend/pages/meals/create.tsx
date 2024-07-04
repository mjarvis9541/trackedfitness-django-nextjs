import Head from "next/head";
import MealForm from "../../app/meals/MealForm";

const CreateMeal = () => {
  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Create Meal - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1 className="text-2xl font-bold">Create Meal</h1>

      <MealForm />
    </div>
  );
};

export default CreateMeal;
