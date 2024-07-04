import { formatISO, subDays } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import DietMealDetailContainer from "../../../../../app/diet/DietMealDetailContainer";
import useDietCreateFromDateMeal from "../../../../../app/diet/useDietCreateFromDateMeal";
import useGetDietMeal from "../../../../../app/diet/useGetDietMeal";
import FormAPIError from "../../../../../components/FormAPIError";
import { formatLongDateStr } from "../../../../../utils/format-date";

const DietCopyPrevious = () => {
  const router = useRouter();
  const {
    username,
    date = formatISO(new Date(), { representation: "date" }),
    meal,
  } = router.query;

  const now = new Date(date);
  const prev = formatISO(subDays(now, 1), { representation: "date" });

  const [apiErrors, setApiErrors] = useState([]);
  const { handleSubmit } = useForm({
    defaultValues: { username: username, date: prev, meal: meal },
  });

  const { isLoading, error, data } = useGetDietMeal({
    username,
    date: prev,
    meal: meal,
  });
  const createMutation = useDietCreateFromDateMeal({
    username,
    date,
    fromDate: prev,
    toDate: date,
    fromMeal: meal,
    toMeal: meal,
  });

  const onSubmit = (values) => {
    createMutation.mutate(values, {
      onSuccess: (data) => {
        setApiErrors([]);
        router.push(`/${username}/diet/${date}`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Copy Previous - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="initial-scale=1.0, width=device-width"
        />
      </Head>

      <h1 className="text-xl font-bold">{formatLongDateStr(date)}</h1>

      <p>
        Copy from: Meal {meal}, {formatLongDateStr(prev)}
      </p>
      <p>
        Copy to: Meal {meal}, {formatLongDateStr(date)}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormAPIError status={apiErrors?.non_field_errors} />

        <div className="grid grid-cols-4 md:grid-cols-[3fr_repeat(9,_minmax(0,_1fr))]">
          <DietMealDetailContainer
            isLoading={isLoading}
            error={error}
            data={data}
          />
        </div>

        <button
          type="submit"
          className="rounded bg-gray-100 py-2 px-4 hover:bg-gray-200"
          disabled={createMutation.isLoading || !data?.length}
        >
          Copy
        </button>
      </form>
    </div>
  );
};

export default DietCopyPrevious;
