"use client";

import { formatISO } from "date-fns";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import FormAPIError from "../../components/FormAPIError";
import Select from "../../components/Select";
import { UserContext } from "../../contexts/UserContext";
import { mealOptions } from "../../utils/constants";
import useCreateDietFromFoodDetail from "./useCreateDietFromFoodDetail";

const DietFoodDetailForm = ({ food }) => {
  const {
    user: { username },
  } = useContext(UserContext);
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState([]);
  const date = formatISO(new Date(), { representation: "date" });

  const { register, handleSubmit } = useForm({
    defaultValues: {
      date: date,
      meal: "1",
      food: food.id,
      quantity_input: food.data_value,
    },
  });

  const createMutation = useCreateDietFromFoodDetail({ username });

  const onSubmit = (data) => {
    createMutation.mutate(data, {
      onSuccess: (data) => {
        router.push(`/${username}/diet/${data.date}/`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormAPIError status={apiErrors?.non_field_errors} />
        <FormAPIError status={apiErrors?.detail} />
        <div>
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            className="w-full rounded border p-2"
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
          <label htmlFor="quantity_input">
            Quantity ({food.data_measurement})
          </label>
          <input
            id="quantity_input"
            type="number"
            className="w-full rounded border p-2"
            step="1"
            {...register("quantity_input")}
          />
          <FormAPIError status={apiErrors?.quantity_input} />
        </div>

        <button
          type="submit"
          className="rounded border bg-gray-100 py-2 px-4 hover:bg-gray-200"
          disabled={createMutation.isLoading}
        >
          {createMutation.isLoading ? "Loading..." : "Add to Diet"}
        </button>
      </form>
    </>
  );
};

export default DietFoodDetailForm;
