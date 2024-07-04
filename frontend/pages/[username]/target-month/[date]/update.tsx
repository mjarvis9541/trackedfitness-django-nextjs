import { format, formatISO } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import useGetDietTargetDate from "../../../../app/targets/useGetDietTargetDate";
import useGetTargetByUsername from "../../../../app/targets/useGetTargetByUsername";
import DailyTargetGramsForm from "../../../../components/DailyTargetGramsForm";

const UpdateOrCreateTarget = () => {
  const router = useRouter();
  const { username, date = formatISO(new Date(), { representation: "date" }) } =
    router.query;

  const {
    isLoading: targetIsLoading,
    error: targetError,
    data: targetData,
  } = useGetTargetByUsername({ username });

  const {
    isLoading: dailyTargetIsLoading,
    error: dailyTargetError,
    data: dailyTargetData,
  } = useGetDietTargetDate({ username, date });

  if (targetIsLoading || dailyTargetIsLoading)
    return (
      <div className="p-2">
        <h1>Loading...</h1>
      </div>
    );
  if (targetError)
    return (
      <div className="p-2">
        <h1>Error</h1>
      </div>
    );

  const updateCreate = dailyTargetData?.date ? "Update" : "Create";
  return (
    <div className="px-3">
      <Head>
        <title>{updateCreate} Diet Targets - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h2>{format(new Date(date), "EEEE dd MMMM yyyy")}</h2>

      <h2>{updateCreate} Diet Targets</h2>

      <DailyTargetGramsForm
        dailyTargetData={dailyTargetData || {}}
        targetData={targetData}
      />
    </div>
  );
};

export default UpdateOrCreateTarget;
