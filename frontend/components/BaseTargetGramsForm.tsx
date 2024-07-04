import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DietTargetTable from "../app/targets/TargetTable";
import useUpdateTarget from "../app/targets/useUpdateTarget";
import { UserContext } from "../contexts/UserContext";
import FormAPIError from "./FormAPIError";

const BaseTargetGramsForm = ({ targetData }) => {
  const router = useRouter();
  const {
    user: { username },
  } = useContext(UserContext);

  const [apiErrors, setApiErrors] = useState([]);
  const { register, handleSubmit, watch } = useForm({
    defaultValues: targetData,
  });

  const updateTargetMutation = useUpdateTarget({ username });

  const [targetState, setTargetState] = useState({
    weight: targetData.weight,
    energy: targetData.energy,
    protein: targetData.protein,
    carbohydrate: targetData.carbohydrate,
    fat: targetData.fat,
  });
  const onSubmit = (data) => {
    updateTargetMutation.mutate(data, {
      onSuccess: (data) => {
        router.push(`/${data.username}`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

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

  return (
    <>
      <div className="my-4">
        <DietTargetTable targetState={targetState} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <FormAPIError status={apiErrors?.non_field_errors} />

        <div>
          <label htmlFor="weight">Weight (kg)</label>
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
          disabled={updateTargetMutation.isLoading}
        >
          Save
        </button>
      </form>
    </>
  );
};

export default BaseTargetGramsForm;
