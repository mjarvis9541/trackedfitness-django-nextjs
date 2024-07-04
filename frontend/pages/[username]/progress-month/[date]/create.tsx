import { formatISO } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import ProgressForm from "../../../../app/progress/ProgressForm";
import { formatLongDateStr } from "../../../../utils/format-date";

const CreateProgress = () => {
  const router = useRouter();
  const { username, date = formatISO(Date.now(), { representation: "date" }) } =
    router.query;

  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Create Progress - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1 className="text-xl font-bold">
        Create Progress - {formatLongDateStr(date)}
      </h1>

      <ProgressForm progressData={{ date: date }} />
    </div>
  );
};

export default CreateProgress;
