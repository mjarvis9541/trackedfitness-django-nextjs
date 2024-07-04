import Head from "next/head";
import FoodForm from "../../app/food/FoodForm";

const CreateFood = () => {
  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Create Food - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1 className="text-2xl font-bold">Create Food</h1>

      <FoodForm />
    </div>
  );
};

export default CreateFood;
