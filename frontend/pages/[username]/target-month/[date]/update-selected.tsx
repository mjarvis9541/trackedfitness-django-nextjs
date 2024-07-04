import { format, formatISO } from "date-fns";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DietTargetTable from "../../../../app/targets/TargetTable";
import useGetTargetByUsername from "../../../../app/targets/useGetTargetByUsername";
import useUpdateCreateDietTargetDateList from "../../../../app/targets/useUpdateCreateDietTargetDateList";
import FormAPIError from "../../../../components/FormAPIError";

const UpdateDailyTargetSelected = () => {
  const [apiErrors, setApiErrors] = useState([]);
  const router = useRouter();
  const {
    username,
    date = formatISO(new Date(), { representation: "date" }),
    dateList,
  } = router.query;

  const parsedDateList = JSON.parse(dateList);

  const { isLoading, error, data } = useGetTargetByUsername({ username });

  const updateDailyTargetsSelected = useUpdateCreateDietTargetDateList({
    username,
    date: date,
    dateList: parsedDateList,
  });

  const onSubmit = (values) => {
    updateDailyTargetsSelected.mutate(values, {
      onSuccess: (data) => {
        setApiErrors([]);
        router.push(`/${username}/diet-week/${date}`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="p-4">
      <Head>
        <title>Update Diet Targets For Selected Dates - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1 className="mb-4 text-xl font-bold">Update Diet Targets For:</h1>

      <ul>
        {parsedDateList.map((date) => (
          <li key={date}>{format(new Date(date), "EEEE dd MMMM yyyy")}</li>
        ))}
      </ul>

      <UpdateDailyTargetSelectedForm
        updateDailyTargetsSelected={updateDailyTargetsSelected}
        data={data}
        onSubmit={onSubmit}
        apiErrors={apiErrors}
      />
    </div>
  );
};

export default UpdateDailyTargetSelected;

const UpdateDailyTargetSelectedForm = ({
  data,
  onSubmit,
  apiErrors,
  updateDailyTargetsSelected,
}) => {
  const { register, handleSubmit, watch } = useForm({ defaultValues: data });

  const [targetState, setTargetState] = useState({
    weight: data.weight,
    energy: data.energy,
    protein: data.protein,
    carbohydrate: data.carbohydrate,
    fat: data.fat,
  });

  useEffect(() => {
    const subscription = watch((data) => {
      const protein = Number(data.protein_per_kg * data.weight).toFixed(1);
      const carbohydrate = Number(
        data.carbohydrate_per_kg * data.weight
      ).toFixed(1);
      const fat = Number(data.fat_per_kg * data.weight).toFixed(1);
      1;
      const energy = Number(protein * 4 + carbohydrate * 4 + fat * 9).toFixed(
        0
      );
      setTargetState({
        weight: data.weight,
        protein: protein,
        carbohydrate: carbohydrate,
        fat: fat,
        energy: energy,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      <div className="my-8">
        <DietTargetTable targetState={targetState} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormAPIError status={apiErrors?.non_field_errors} />

        <div>
          <label htmlFor="weight">Weight kg</label>
          <input
            id="weight"
            type="number"
            step="0.01"
            className="w-full rounded border p-2"
            {...register("weight")}
          />
          <FormAPIError status={apiErrors?.weight} />
        </div>

        <div>
          <label htmlFor="protein_per_kg">Protein per kg</label>
          <input
            id="protein_per_kg"
            type="number"
            step="0.05"
            className="w-full rounded border p-2"
            {...register("protein_per_kg")}
          />
          <FormAPIError status={apiErrors?.protein_per_kg} />
        </div>

        <div>
          <label htmlFor="carbohydrate_per_kg">Carbohydrate per kg</label>
          <input
            id="carbohydrate_per_kg"
            type="number"
            step="0.05"
            className="w-full rounded border p-2"
            {...register("carbohydrate_per_kg")}
          />
          <FormAPIError status={apiErrors?.carbohydrate_per_kg} />
        </div>

        <div>
          <label htmlFor="fat_per_kg">Fat per kg</label>
          <input
            id="fat_per_kg"
            type="number"
            step="0.05"
            className="w-full rounded border p-2"
            {...register("fat_per_kg")}
          />
          <FormAPIError status={apiErrors?.fat_per_kg} />
        </div>

        <button
          className="rounded border bg-gray-100 py-2 px-4 hover:bg-gray-200"
          type="submit"
          disabled={updateDailyTargetsSelected.isLoading}
        >
          Save
        </button>
        {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
        {/* <pre>{JSON.stringify(targetState, null, 2)}</pre> */}
      </form>
    </>
  );
};
