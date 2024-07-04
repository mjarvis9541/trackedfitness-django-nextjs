import { formatISO } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import DietMonthListFooter from "../../../app/diet/DietMonthListFooter";
import DietMonthListHeader from "../../../app/diet/DietMonthListHeader";
import DietMonthListItem from "../../../app/diet/DietMonthListItem";
import useGetDietMonth from "../../../app/diet/useGetDietMonth";
import DateNav from "../../../components/DateNav";
import UserNav from "../../../components/UserNav";
import useCheckMergedDates from "../../../hooks/useCheckMergedDates";
import createMonthRange from "../../../utils/create-month-range";
import { formatMonthYear } from "../../../utils/format-date";

const DietMonth = () => {
  const router = useRouter();
  const { username, date = formatISO(new Date(), { representation: "date" }) } =
    router.query;
  const { isLoading, error, data } = useGetDietMonth({ username, date });
  const monthRange = createMonthRange(date);

  return (
    <div className="px-3">
      <Head>
        <title>Diet Month - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <UserNav username={username} />
      <DateNav
        username={username}
        date={date}
        modifier="month"
        segment="diet-month"
      />

      <h1 className="my-3 text-xl font-bold">{formatMonthYear(date)}</h1>

      <p className="my-4">
        View all diet totals for given month. Click on a date to view your diet
        log for that individual date.
      </p>

      <div className="grid grid-cols-[auto_repeat(17,_minmax(0,_1fr))]">
        <>
          {isLoading && (
            <div className="flex items-center border-b-[1px] p-2">
              Loading...
            </div>
          )}
        </>
        <>
          {error && (
            <div className="flex items-center border-b-[1px] p-2">Error</div>
          )}
        </>

        {data && (
          <MonthContainer
            username={username}
            monthRange={monthRange}
            isLoading={isLoading}
            error={error}
            data={data}
          />
        )}
      </div>

      <button
        className="my-4 rounded bg-red-600 py-2 px-4 text-white hover:bg-red-700 disabled:bg-gray-400"
        disabled={true}
      >
        Delete
      </button>
    </div>
  );
};

export default DietMonth;

const MonthContainer = ({ username, monthRange, isLoading, error, data }) => {
  const merger = monthRange.map((dr) => {
    const obj = data.find((obj) => obj.date === dr.date);
    if (obj) return { ...dr, ...obj };
    return dr;
  });

  const { isCheck, isCheckAll, handleCheck, handleCheckAll, resetCheck } =
    useCheckMergedDates({
      data: merger,
    });

  return (
    <>
      <DietMonthListHeader
        isCheckAll={isCheckAll}
        handleCheckAll={handleCheckAll}
      />
      {merger.map((data) => (
        <DietMonthListItem
          key={data.date}
          isCheck={isCheck}
          handleCheck={handleCheck}
          username={username}
          data={data}
        />
      ))}
      <DietMonthListFooter isCheck={isCheck} />
    </>
  );
};
