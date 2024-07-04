"use client";

import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormAPIError from "../../components/FormAPIError";
import Select from "../../components/Select";
import { servingOptions } from "../../utils/constants";
import useCreateFoodFromBrand from "./useCreateFoodFromBrand";

const BrandFoodForm = () => {
  const router = useRouter();
  const { id } = router.query;
  const [apiErrors, setApiErrors] = useState([]);

  const { register, handleSubmit } = useForm();

  const createFoodMutation = useCreateFoodFromBrand({ id });

  const onSubmit = (data) => {
    createFoodMutation.mutate(data, {
      onSuccess: (data) => {
        setApiErrors([]);
        router.push(`/food/${data.id}`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />

      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          className="mt-1 w-full rounded border p-2"
          {...register("name")}
        />
        <FormAPIError status={apiErrors?.name} />
      </div>

      <div>
        <label htmlFor="serving">Serving</label>
        <Select
          id="serving"
          register={register("serving")}
          options={servingOptions}
        />
        <FormAPIError status={apiErrors?.serving} />
      </div>

      <div>
        <label htmlFor="energy">Calories (kcal)</label>
        <input
          className="mt-1 w-full rounded border p-2"
          id="energy"
          type="number"
          step="1"
          {...register("energy")}
        />
        <FormAPIError status={apiErrors?.energy} />
      </div>

      <div>
        <label htmlFor="fat">Fat (g)</label>
        <input
          className="mt-1 w-full rounded border p-2"
          id="fat"
          type="number"
          step="0.1"
          {...register("fat")}
        />
        <FormAPIError status={apiErrors?.fat} />
      </div>

      <div>
        <label htmlFor="saturates">Saturates (g)</label>
        <input
          id="saturates"
          type="number"
          step="0.1"
          className="mt-1 w-full rounded border p-2"
          {...register("saturates")}
        />
        <FormAPIError status={apiErrors?.saturates} />
      </div>

      <div>
        <label htmlFor="carbohydrate">Carbohydrate (g)</label>
        <input
          id="carbohydrate"
          type="number"
          step="0.1"
          className="mt-1 w-full rounded border p-2"
          {...register("carbohydrate")}
        />
        <FormAPIError status={apiErrors?.carbohydrate} />
      </div>

      <div>
        <label htmlFor="sugars">Sugars (g)</label>
        <input
          className="mt-1 w-full rounded border p-2"
          id="sugars"
          type="number"
          step="0.1"
          {...register("sugars")}
        />
        <FormAPIError status={apiErrors?.sugars} />
      </div>

      <div>
        <label htmlFor="fibre">Fibre (g)</label>
        <input
          className="mt-1 w-full rounded border p-2"
          id="fibre"
          type="number"
          step="0.1"
          {...register("fibre")}
        />
        <FormAPIError status={apiErrors?.fibre} />
      </div>

      <div>
        <label htmlFor="protein">Protein (g)</label>
        <input
          className="mt-1 w-full rounded border p-2"
          id="protein"
          type="number"
          step="0.1"
          {...register("protein")}
        />
        <FormAPIError status={apiErrors?.protein} />
      </div>

      <div>
        <label htmlFor="salt">Salt (g)</label>
        <input
          className="mt-1 w-full rounded border p-2"
          id="salt"
          type="number"
          step="0.01"
          {...register("salt")}
        />
        <FormAPIError status={apiErrors?.salt} />
      </div>

      <button
        type="submit"
        className="rounded border bg-gray-100 py-2 px-4 hover:bg-gray-200"
        disabled={createFoodMutation.isLoading}
      >
        {createFoodMutation.isLoading ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

export default BrandFoodForm;
