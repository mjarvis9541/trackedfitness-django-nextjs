import Head from "next/head";
import { useRouter } from "next/router";
import BrandFoodForm from "../../../app/brands/BrandFoodForm";
import useGetBrand from "../../../app/brands/useGetBrand";

const BrandCreateFood = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, error, data } = useGetBrand({ id });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Create food for {data.name} - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1 className="text-2xl font-bold">Create Food for {data.name}</h1>

      <BrandFoodForm />
    </div>
  );
};

export default BrandCreateFood;
