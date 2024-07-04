import { formatISO } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import useDeleteProgress from "../../../../app/progress/useDeleteProgress";
import useGetProgressDay from "../../../../app/progress/useGetProgressDay";

const DeleteProgress = () => {
  const router = useRouter();
  const { username, date = formatISO(Date.now(), { representation: "date" }) } =
    router.query;

  const { isLoading, error, data } = useGetProgressDay({ username, date });

  const deleteProgress = useDeleteProgress({ id: data?.id, date });

  const handleDelete = (values) => {
    deleteProgress.mutate(values, {
      onSuccess: (data) => {
        router.push(`/${username}/progress-month/${date}`);
      },
      onError: (error) => {},
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Delete Progress - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1 className="text-xl font-bold">Delete Progress</h1>

      <p>Are you sure you wish to delete your progress log for this date?</p>

      <p>This action cannot be undone.</p>

      <button
        className="rounded bg-red-600 py-2 px-4 text-white hover:bg-red-700"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
};

export default DeleteProgress;
