import { formatISO } from "date-fns";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import DietForm from "../../../../../../app/diet/DietForm";
import useGetDiet from "../../../../../../app/diet/useGetDiet";
import { formatLongDateStr } from "../../../../../../utils/format-date";

const DietUpdate = () => {
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
        <title>Edit Diet Entry - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1 className="text-xl font-bold">
        Meal {meal}, {formatLongDateStr(date)}
      </h1>

      <div>
        <Link href={`/food/${data?.food_id}/`}>{data?.food_name}</Link>
      </div>

      <div>
        <Link href={`/brands/${data?.brand_id}/`}> {data?.brand_name}</Link>
      </div>

      <DietForm data={data} />
    </div>
  );
};

export default DietUpdate;
