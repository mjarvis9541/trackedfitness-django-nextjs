import { formatISO } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DietTargetTable from "../app/targets/TargetTable";
import useCreateDietTarget from "../app/targets/useCreateDietTarget";
import useUpdateDietTarget from "../app/targets/useUpdateDietTarget";
import FormAPIError from "./FormAPIError";

const DailyTargetGramsForm = ({ targetData, dailyTargetData }) => {
  const router = useRouter();
  const { username, date = formatISO(new Date(), { representation: "date" }) } =
    router.query;

  const [apiErrors, setApiErrors] = useState([]);
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      username: username,
      date: date,
      weight: dailyTargetData.weight || targetData.weight, // make sure this is profile weight.
      protein_per_kg:
        dailyTargetData.protein_per_kg || targetData.protein_per_kg,
      carbohydrate_per_kg:
        dailyTargetData.carbohydrate_per_kg || targetData.carbohydrate_per_kg,
      fat_per_kg: dailyTargetData.fat_per_kg || targetData.fat_per_kg,
    },
  });

  const updateMutation = useUpdateDietTarget({ id: dailyTargetData.id });
  const createMutation = useCreateDietTarget();

  const [targetState, setTargetState] = useState(dailyTargetData || targetData);

  useEffect(() => {
    const subscription = watch((data) => {
      const protein = Number(data.protein_per_kg * data.weight).toFixed();
      const carbohydrate = Number(
        data.carbohydrate_per_kg * data.weight
      ).toFixed();
      const fat = Number(data.fat_per_kg * data.weight).toFixed();
      const energy = Number(protein * 4 + carbohydrate * 4 + fat * 9).toFixed();
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

  const onSubmit = (data) => {
    if (dailyTargetData.id) {
      updateMutation.mutate(data, {
        onSuccess: (data) => {
          router.push(`/${username}/diet-week/${data.date}`);
        },
        onError: (error) => {
          setApiErrors(error.response.data);
        },
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: (data) => {
          router.push(`/${username}/diet-week/${data.date}`);
        },
        onError: (error) => {
          setApiErrors(error.response.data);
        },
      });
    }
  };

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
            step="0.01"
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
            step="0.01"
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
            step="0.01"
            className="w-full rounded border p-2"
            {...register("fat_per_kg")}
          />
          <FormAPIError status={apiErrors?.fat_per_kg} />
        </div>

        <button
          type="submit"
          className="rounded bg-gray-100 py-2 px-4 hover:bg-gray-200"
          disabled={createMutation.isLoading}
        >
          Save
        </button>
      </form>
    </>
  );
};

export default DailyTargetGramsForm;
