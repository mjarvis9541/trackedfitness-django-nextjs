"use client";

import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import FormAPIError from "../../components/FormAPIError";
import Select from "../../components/Select";
import { mealOptions } from "../../utils/constants";
import useCreateDiet from "./useCreateDiet";
import useUpdateDiet from "./useUpdateDiet";

const DietForm = ({ data }) => {
  const router = useRouter();
  const { username, date, meal, id } = router.query;
  const [apiErrors, setApiErrors] = useState([]);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      ...data,
      username: username,
      quantity_input: data.data_value,
    },
  });
  const createMutation = useCreateDiet();
  const updateMutation = useUpdateDiet({ id });

  const onSubmit = (data) => {
    if (!id) {
      updateMutation.mutate(data, {
        onSuccess: (data) => {
          router.push(`/${username}/diet/${data.date}/`);
        },
        onError: (error) => {
          setApiErrors(error.response.data);
        },
      });
    }
    if (id) {
      updateMutation.mutate(data, {
        onSuccess: (data) => {
          router.push(`/${username}/diet/${data.date}/`);
        },
        onError: (error) => {
          setApiErrors(error.response.data);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />

      <div>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          className="mt-1 w-full rounded border p-2"
          {...register("date")}
        />
        <FormAPIError status={apiErrors?.date} />
      </div>

      <div>
        <label htmlFor="meal">Meal</label>
        <Select id="meal" register={register("meal")} options={mealOptions} />
        <FormAPIError status={apiErrors?.meal} />
      </div>

      <div>
        <label htmlFor="quantity_input">Quantity</label>
        <input
          autoFocus
          id="quantity_input"
          type="number"
          step="0.1"
          className="mt-1 w-full rounded border p-2"
          {...register("quantity_input")}
        />
        <FormAPIError status={apiErrors?.quantity_input} />
      </div>

      <button
        type="submit"
        className="rounded border bg-gray-100 py-2 px-4 hover:bg-gray-200"
        disabled={createMutation.isLoading || updateMutation.isLoading}
      >
        {createMutation.isLoading || updateMutation.isLoading
          ? "Saving..."
          : "Save"}
      </button>
    </form>
  );
};

export default DietForm;
