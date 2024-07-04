"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormAPIError from "../../components/FormAPIError";
import Select from "../../components/Select";
import {
  activityLevelOptions,
  goalOptions,
  sexOptions,
} from "../../utils/constants";
import useUpdateProfile from "./useUpdateProfile";

export default function ProfileUpdateForm({ data }) {
  const router = useRouter();
  const { register, handleSubmit } = useForm({ defaultValues: data });
  const [apiErrors, setApiErrors] = useState({});

  const mutation = useUpdateProfile();

  const onSubmit = (values) =>
    mutation.mutate(values, {
      onSuccess: (data) => {
        router.push(`/profile`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />

      <div>
        <label htmlFor="goal">Fitness Goal</label>
        <Select id="goal" options={goalOptions} register={register("goal")} />
        <FormAPIError status={apiErrors?.goal} />
      </div>

      <div>
        <label htmlFor="activity_level">Activity Level</label>
        <Select
          id="activity_level"
          options={activityLevelOptions}
          register={register("activity_level")}
        />
        <FormAPIError status={apiErrors?.activity_level} />
      </div>

      <div>
        <label htmlFor="sex">Sex</label>
        <Select id="sex" options={sexOptions} register={register("sex")} />
        <FormAPIError status={apiErrors?.sex} />
      </div>

      <div>
        <label htmlFor="height">Height (cm)</label>
        <input
          id="height"
          type="number"
          autoComplete="off"
          className="mt-1 w-full rounded border p-2"
          {...register("height")}
        />
        <FormAPIError status={apiErrors?.height} />
      </div>

      <div>
        <label htmlFor="weight">Weight (kg)</label>
        <input
          id="weight"
          type="number"
          autoComplete="off"
          className="mt-1 w-full rounded border p-2"
          {...register("weight")}
        />
        <FormAPIError status={apiErrors?.weight} />
      </div>

      <div>
        <label htmlFor="date_of_birth">Date of Birth</label>
        <input
          id="date_of_birth"
          type="date"
          autoComplete="off"
          className="mt-1 w-full rounded border p-2"
          {...register("date_of_birth")}
        />
        <FormAPIError status={apiErrors?.date_of_birth} />
      </div>

      <button
        type="submit"
        className="rounded border bg-gray-100 py-2 px-4 hover:bg-gray-300"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? "Loading..." : "Save"}
      </button>
    </form>
  );
}
