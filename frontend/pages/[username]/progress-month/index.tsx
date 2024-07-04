import { formatISO } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import ProgressListContainer from "../../../app/progress/ProgressListContainer";
import useBulkDeleteProgress from "../../../app/progress/useBulkDeleteProgress";
import useGetProgressMonth from "../../../app/progress/useGetProgressMonth";
import DateNav from "../../../components/DateNav";
import UserNav from "../../../components/UserNav";
import useCheckDates from "../../../hooks/useCheckDates";
import createMonthRange from "../../../utils/create-month-range";
import { formatMonthYear } from "../../../utils/format-date";

const ProgressMonth = () => {
  const router = useRouter();
  const { username, date = formatISO(new Date(), { representation: "date" }) } =
    router.query;
  const { isLoading, error, data } = useGetProgressMonth({
    username,
    date,
  });
  const monthRange = createMonthRange(date);
  const [apiErrors, setApiErrors] = useState([]);
  const { isCheck, isCheckAll, handleCheck, handleCheckAll, resetCheck } =
    useCheckDates({
      data,
    });
  const bulkDeleteProgress = useBulkDeleteProgress({
    username: username,
    date: date,

    dateList: isCheck,
  });
  const handleDelete = (values) => {
    bulkDeleteProgress.mutate(values, {
      onSuccess: () => {
        setApiErrors([]);
        resetCheck();
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  return (
    <div className="px-3">
      <Head>
        <title>Progress - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <UserNav username={username} />
      <DateNav
        username={username}
        date={date}
        modifier="month"
        segment="progress-month"
      />

      <h1 className="my-3 text-xl font-bold">{formatMonthYear(date)}</h1>

      <p className="my-4">
        Record energy burnt and body weight (kg) over the given month. Weekly
        averages are calculated for the aforementioned values. Click on a date
        to create or update an entry.
      </p>

      <div className="grid grid-cols-[auto_repeat(6,_minmax(0,_auto))_5fr]">
        <ProgressListContainer
          username={username}
          isCheck={isCheck}
          isCheckAll={isCheckAll}
          handleCheck={handleCheck}
          handleCheckAll={handleCheckAll}
          isLoading={isLoading}
          error={error}
          data={data}
          monthRange={monthRange}
        />
      </div>

      <button
        className="my-4 rounded bg-red-600 py-2 px-4 text-white hover:bg-red-700 disabled:bg-gray-400"
        onClick={handleDelete}
        disabled={!isCheck.length}
      >
        Delete
      </button>
    </div>
  );
};

export default ProgressMonth;
