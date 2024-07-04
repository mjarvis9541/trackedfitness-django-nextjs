import { formatISO } from "date-fns";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import ProgressForm from "../../../../app/progress/ProgressForm";
import useGetProgressDay from "../../../../app/progress/useGetProgressDay";
import { formatLongDateStr } from "../../../../utils/format-date";

const UpdateProgress = () => {
  const router = useRouter();
  const { username, date = formatISO(Date.now(), { representation: "date" }) } =
    router.query;
  const { isLoading, error, data, status } = useGetProgressDay({
    username,
    date,
  });

  if (isLoading)
    return (
      <div className="p-2">
        <h1>Loading...</h1>
      </div>
    );
  if (error) {
    router.push(`/${username}/progress-month/${date}/create`);
  }

  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Update Progress - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1 className="text-xl font-bold">
        Update Progress - {formatLongDateStr(date)}
      </h1>

      <ProgressForm progressData={data} />

      {data?.id && (
        <div>
          <Link
            href={`/${username}/progress-month/${data.date}/delete`}
            className="hover:underline"
          >
            Delete
          </Link>
        </div>
      )}
    </div>
  );
};

export default UpdateProgress;
