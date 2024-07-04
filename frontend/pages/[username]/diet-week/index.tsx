import { format, formatISO } from "date-fns";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import DietWeekList from "../../../app/diet/DietWeekList";
import useDeleteDietDateList from "../../../app/diet/useDeleteDietDateList";
import useGetDietWeek from "../../../app/diet/useGetDietWeek";
import DietTargetWeekList from "../../../app/targets/DietTargetWeekList";
import useCopyDietTargetPreviousWeek from "../../../app/targets/useCopyDietTargetPreviousWeek";
import useDeleteDietTargetDateList from "../../../app/targets/useDeleteDietTargetDateList";
import useGetDietTargetWeek from "../../../app/targets/useGetDietTargetWeek";
import useGetTargetByUsername from "../../../app/targets/useGetTargetByUsername";
import DateNav from "../../../components/DateNav";
import UserNav from "../../../components/UserNav";
import createWeekRange from "../../../utils/create-week-range";

const DietWeek = () => {
  const router = useRouter();
  const { username, date = formatISO(new Date(), { representation: "date" }) } =
    router.query;

  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [weekListIsCheckAll, setWeekListIsCheckAll] = useState(false);
  const [weekListIsCheck, setWeekListIsCheck] = useState([]);

  const [apiErrors, setApiErrors] = useState([]);

  const dateRange = createWeekRange(date);

  const { isLoading, error, data } = useGetDietWeek({ username, date });
  const {
    isLoading: targetDataIsLoading,
    error: targetDataError,
    data: targetData,
  } = useGetDietTargetWeek({ username, date });

  const {
    isLoading: baseTargetIsLoading,
    error: baseTargetError,
    data: baseTargetData,
  } = useGetTargetByUsername({ username });

  const handleCheckAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(dateRange?.map((data) => data.date));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };
  const handleCheck = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };
  const handleCheckAllTargets = (e) => {
    setWeekListIsCheckAll(!weekListIsCheckAll);
    setWeekListIsCheck(dateRange?.map((data) => data.date));
    if (weekListIsCheckAll) {
      setWeekListIsCheck([]);
    }
  };
  const handleCheckTargets = (e) => {
    const { id, checked } = e.target;
    setWeekListIsCheck([...weekListIsCheck, id]);
    if (!checked) {
      setWeekListIsCheck(weekListIsCheck.filter((item) => item !== id));
    }
  };
  const deleteDietDateList = useDeleteDietDateList({
    username,
    date,
    dateList: isCheck,
  });
  const deleteDietTargetDateList = useDeleteDietTargetDateList({
    username,
    date,
    dateList: weekListIsCheck,
  });

  const copyDietTargetPreviousWeek = useCopyDietTargetPreviousWeek({
    username,
    date,
  });

  const handleCopyDietTargetPreviousWeek = (data) => {
    copyDietTargetPreviousWeek.mutate(data, {
      onSuccess: (data) => {
        setApiErrors([]);
        setIsCheckAll(false);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  const handleDeleteDietDateList = (data) => {
    deleteDietDateList.mutate(data, {
      onSuccess: (data) => {
        setApiErrors([]);
        setIsCheck([]);
        setIsCheckAll(false);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  const handleDeleteDietTargetDateList = (data) => {
    deleteDietTargetDateList.mutate(data, {
      onSuccess: (data) => {
        setApiErrors([]);
        setWeekListIsCheck([]);
        setWeekListIsCheckAll(false);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  return (
    <div className="px-3">
      <Head>
        <title>Diet Week - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <UserNav username={username} />
      <DateNav
        username={username}
        date={date}
        modifier="week"
        segment="diet-week"
      />

      <p className="font-bold text-gray-500">
        Week {format(new Date(date), "I")}
      </p>

      <h1 className="my-3 text-xl font-bold">Diet Week</h1>
      <div className="grid grid-cols-[auto_repeat(15,_minmax(0,_1fr))]">
        <DietWeekList
          username={username}
          isLoading={isLoading}
          error={error}
          data={data}
          isCheck={isCheck}
          dateRange={dateRange}
          isCheckAll={isCheckAll}
          handleCheck={handleCheck}
          handleCheckAll={handleCheckAll}
        />
      </div>

      <div className="my-4 flex gap-4">
        <button
          disabled={!isCheck.length}
          className="rounded bg-red-600 py-2 px-4 text-white hover:bg-red-700 disabled:bg-gray-400"
          onClick={handleDeleteDietDateList}
        >
          Delete
        </button>
      </div>

      {/* Targets */}
      <h2 className="my-3 text-xl font-bold">Diet Week Targets</h2>
      <div className="grid grid-cols-[auto_repeat(15,_minmax(0,_1fr))]">
        <DietTargetWeekList
          dateRange={dateRange}
          username={username}
          isLoading={targetDataIsLoading}
          error={targetDataError}
          data={targetData}
          baseTargetIsLoading={baseTargetIsLoading}
          baseTargetError={baseTargetError}
          baseTargetData={baseTargetData}
          isCheck={weekListIsCheck}
          isCheckAll={weekListIsCheckAll}
          handleCheck={handleCheckTargets}
          handleCheckAll={handleCheckAllTargets}
        />
      </div>
      <div className="mt-4 flex gap-4">
        <button
          disabled={!weekListIsCheck.length}
          onClick={handleDeleteDietTargetDateList}
          className="rounded bg-red-600 py-2 px-4 text-white hover:bg-red-700 disabled:bg-gray-400"
        >
          Delete
        </button>

        <Link
          href={{
            pathname: `/${username}/target-month/${date}/update-selected`,
            query: {
              dateList: JSON.stringify(weekListIsCheck),
            },
          }}
          className="inline-block rounded bg-gray-100 py-2 px-4 hover:bg-gray-200"
        >
          Update
        </Link>

        <button
          className="rounded bg-gray-100 py-2 px-4 hover:bg-gray-200"
          onClick={handleCopyDietTargetPreviousWeek}
        >
          Copy Previous Week
        </button>
      </div>
    </div>
  );
};

export default DietWeek;
