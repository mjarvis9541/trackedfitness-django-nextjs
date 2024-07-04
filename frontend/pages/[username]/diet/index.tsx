import { formatISO, subDays } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import DietDayTotal from "../../../app/diet/DietDayTotal";
import DietListTarget from "../../../app/diet/DietListTarget";
import DietListTotal from "../../../app/diet/DietListTotal";
import DietMealListContainer from "../../../app/diet/DietMealListContainer";
import useDeleteDietIdList from "../../../app/diet/useDeleteDietIdList";
import useDietCreateFromDate from "../../../app/diet/useDietCreateFromDate";
import useGetDietDay from "../../../app/diet/useGetDietDay";
import useSaveDietSelected from "../../../app/diet/useSaveDietSelected";
import DietTarget from "../../../app/targets/DietTarget";
import useGetDietTargetDate from "../../../app/targets/useGetDietTargetDate";
import useGetTargetByUsername from "../../../app/targets/useGetTargetByUsername";
import DateNav from "../../../components/DateNav";
import FormAPIError from "../../../components/FormAPIError";
import UserNav from "../../../components/UserNav";

const mealList = [
  { order: 1, name: "Breakfast" },
  { order: 2, name: "Morning Snack" },
  { order: 3, name: "Lunch" },
  { order: 4, name: "Afternoon Snack" },
  { order: 5, name: "Dinner" },
  { order: 6, name: "Evening Snack" },
];

const DietDay = () => {
  const router = useRouter();
  const { username, date = formatISO(new Date(), { representation: "date" }) } =
    router.query;
  const { isLoading, error, data } = useGetDietDay({ username, date });
  const [apiErrors, setApiErrors] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const now = new Date(date);
  const prev = date && formatISO(subDays(now, 1), { representation: "date" });
  const dietCopyPreviousDay = useDietCreateFromDate({ username, prev, date });
  const [mealName, setMealName] = useState("");
  const deleteMutation = useDeleteDietIdList({ username, date, isCheck });
  const saveSelected = useSaveDietSelected({ mealName, isCheck });

  const {
    isLoading: targetIsLoading,
    error: targetError,
    data: targetData,
  } = useGetTargetByUsername({
    username,
  });
  const {
    isLoading: dayTargetIsLoading,
    error: dayTargetError,
    data: dayTargetData,
  } = useGetDietTargetDate({ username, date });

  const handleCheck = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  const handleDelete = (data) => {
    deleteMutation.mutate(data, {
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

  const handleSave = (data) => {
    saveSelected.mutate(data, {
      onSuccess: (data) => {
        setApiErrors([]);
        setIsCheck([]);
        setIsCheckAll(false);
        router.push(`/meals/${data.meal_id}`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  const handleCopyPreviousDay = (data) => {
    dietCopyPreviousDay.mutate(data, {
      onSuccess: (data) => {
        setApiErrors([]);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  return (
    <div className="overflow-scroll px-3">
      <Head>
        <title>Diet - Trackedfitness</title>
        <meta name="description" content="Log and track daily food intake" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <UserNav username={username} />
      <DateNav username={username} date={date} modifier="day" segment="diet" />

      <FormAPIError status={apiErrors?.non_field_errors} />

      <div className="grid grid-cols-4 md:grid-cols-[auto_3fr_repeat(9,_minmax(0,_1fr))]">
        {mealList.map((meal) => (
          <DietMealListContainer
            key={meal.order}
            username={username}
            date={date}
            meal={meal}
            isLoading={isLoading}
            error={error}
            data={data}
            isCheck={isCheck}
            setIsCheck={setIsCheck}
            handleCheck={handleCheck}
            setApiErrors={setApiErrors}
          />
        ))}

        <DietListTotal data={data} error={error} isLoading={isLoading} />
        <DietListTarget
          targetIsLoading={targetIsLoading}
          targetError={targetError}
          targetData={targetData}
          dayTargetIsLoading={dayTargetIsLoading}
          dayTargetError={dayTargetError}
          dayTargetData={dayTargetData}
        />
        {/* <DietListRemaining data={data} error={error} isLoading={isLoading} /> */}
      </div>

      <div className="my-4 flex flex-wrap gap-4">
        <button
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-gray-300"
          disabled={!isCheck.length}
          onClick={handleDelete}
        >
          Delete
        </button>
        <input
          type="text"
          className="rounded border p-2 disabled:bg-gray-200"
          placeholder="Meal name"
          value={mealName}
          disabled={!isCheck.length}
          onChange={(e) => setMealName(e.target.value)}
        />
        <FormAPIError status={apiErrors?.meal_name} />{" "}
        <button
          className="rounded bg-gray-100 px-4 py-2 hover:bg-gray-300 disabled:bg-gray-300 disabled:text-white"
          disabled={!isCheck.length}
          onClick={handleSave}
        >
          Save as Meal
        </button>
        <button
          className="rounded bg-gray-100 px-4 py-2 hover:bg-gray-300"
          onClick={handleCopyPreviousDay}
        >
          Copy Previous Day
        </button>
      </div>

      <div className="mt-6">
        <h3 className="my-4 text-xl font-bold">Daily Totals</h3>
        <DietDayTotal data={data} error={error} isLoading={isLoading} />
      </div>
      <div className="my-6">
        <h3 className="my-4 text-xl font-bold">Daily Targets</h3>
        <DietTarget />
      </div>
    </div>
  );
};

export default DietDay;
