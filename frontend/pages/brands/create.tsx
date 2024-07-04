import Head from "next/head";
import BrandForm from "../../app/brands/BrandForm";

const CreateBrand = () => {
  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Create Brand - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1 className="text-2xl font-bold">Create Brand</h1>

      <BrandForm />
    </div>
  );
};

export default CreateBrand;
