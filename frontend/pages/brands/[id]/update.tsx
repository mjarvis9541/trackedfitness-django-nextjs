import Head from "next/head";
import { useRouter } from "next/router";
import BrandForm from "../../../app/brands/BrandForm";
import useGetBrand from "../../../app/brands/useGetBrand";

const BrandUpdate = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, error, data } = useGetBrand({ id });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Edit Brand - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Edit food" />
      </Head>

      <h1 className="text-2xl font-bold">Edit Brand</h1>

      <BrandForm data={data} />
    </div>
  );
};

export default BrandUpdate;
