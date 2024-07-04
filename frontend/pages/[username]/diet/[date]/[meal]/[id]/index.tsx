import { format, formatISO } from "date-fns";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import DietDetailTable from "../../../../../../app/diet/DietDetailTable";
import useGetDiet from "../../../../../../app/diet/useGetDiet";

const DietDetail = () => {
  const router = useRouter();
  const {
    username,
    date = formatISO(new Date(), { representation: "date" }),
    meal,
    id,
  } = router.query;

  const { isLoading, error, data } = useGetDiet({ id });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Diet Detail - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1 className="text-xl font-bold">
        Meal {meal}, {format(new Date(date), "EEEE dd MMMM yyyy")}
      </h1>

      <div>
        <Link href={`/food/${data?.food_id}/`}>{data?.food_name}</Link>
      </div>

      <div>
        <Link href={`/brands/${data?.brand_id}/`}>{data?.brand_name}</Link>
      </div>

      <h2 className="font-bold">Nutrition Information</h2>

      <DietDetailTable data={data} />

      <div>
        <Link
          href={`/${username}/diet/${date}/${meal}/${id}/update`}
          className="hover:underline"
        >
          Edit
        </Link>
      </div>

      <div>
        <Link
          href={`/${username}/diet/${date}/${meal}/${id}/delete`}
          className="hover:underline"
        >
          Delete
        </Link>
      </div>
    </div>
  );
};

export default DietDetail;
