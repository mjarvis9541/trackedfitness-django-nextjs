import { formatISO } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import TargetMonthListFooter from "../../../app/targets/TargetMonthListFooter";
import TargetMonthListHeader from "../../../app/targets/TargetMonthListHeader";
import TargetMonthListItem from "../../../app/targets/TargetMonthListItem";
import useDeleteDietTargetDateList from "../../../app/targets/useDeleteDietTargetDateList";
import useGetDietTargetMonth from "../../../app/targets/useGetDietTargetMonth";
import DateNav from "../../../components/DateNav";
import FormAPIError from "../../../components/FormAPIError";
import UserNav from "../../../components/UserNav";
import useCheckMergedDates from "../../../hooks/useCheckMergedDates";
import createMonthRange from "../../../utils/create-month-range";
import { formatMonthYear } from "../../../utils/format-date";

const TargetMonth = () => {
  const router = useRouter();
  const { username, date = formatISO(new Date(), { representation: "date" }) } =
    router.query;

  const { isLoading, error, data } = useGetDietTargetMonth({ username, date });
  const monthRange = createMonthRange(date);

  return (
    <div className="px-3">
      <Head>
        <title>Target Month - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <UserNav username={username} />
      <DateNav
        username={username}
        date={date}
        modifier="month"
        segment="target-month"
      />

      <h1 className="my-3 text-xl font-bold">{formatMonthYear(date)}</h1>

      <p className="my-4">
        View all customised daily diet targets for given month. Click on a date
        to create or update an entry.
      </p>

      <>{isLoading && <div>Loading...</div>}</>
      <>{error && <div>Error</div>}</>

      {data && (
        <MonthContainer
          date={date}
          username={username}
          monthRange={monthRange}
          isLoading={isLoading}
          error={error}
          data={data}
        />
      )}
    </div>
  );
};

export default TargetMonth;

const MonthContainer = ({ date, username, monthRange, data }) => {
  const [apiErrors, setApiErrors] = useState([]);
  const merger = monthRange.map((dr) => {
    const obj = data.find((obj) => obj.date === dr.date);
    if (obj) return { ...dr, ...obj };
    return dr;
  });

  const { isCheck, isCheckAll, handleCheck, handleCheckAll, resetCheck } =
    useCheckMergedDates({
      data: merger,
    });
  const deleteDietTargetDateList = useDeleteDietTargetDateList({
    username,
    date,
    dateList: isCheck,
  });
  const handleDeleteDietDateList = (data) => {
    deleteDietTargetDateList.mutate(data, {
      onSuccess: (data) => {
        setApiErrors([]);
        resetCheck();
      },
      onError: (error) => {
        resetCheck();
        setApiErrors(error.response.data);
      },
    });
  };
  return (
    <>
      <FormAPIError status={apiErrors?.non_field_errors} />
      <div className="grid md:grid-cols-[auto_repeat(17,_minmax(0,_1fr))]">
        <TargetMonthListHeader
          isCheckAll={isCheckAll}
          handleCheckAll={handleCheckAll}
        />
        {merger.map((data) => (
          <TargetMonthListItem
            key={data.date}
            isCheck={isCheck}
            handleCheck={handleCheck}
            username={username}
            data={data}
          />
        ))}
        <TargetMonthListFooter isCheck={isCheck} />
      </div>
      <button
        className="my-4 rounded bg-red-600 py-2 px-4 text-white hover:bg-red-700 disabled:bg-gray-400"
        onClick={handleDeleteDietDateList}
        disabled={!isCheck.length || deleteDietTargetDateList.isLoading}
      >
        Delete
      </button>
    </>
  );
};
