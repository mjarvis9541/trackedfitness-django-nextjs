"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { API, mealOptions } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { formatISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type DietInput = {
  date: string;
  meal: string;
  food: string;
  username: string;
  quantity_input: string;
};

async function mutateDiet({
  values,
  token,
}: {
  values: DietInput;
  token: string | undefined;
}) {
  const res = await fetch(`${API}/diet/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    throw {
      message: `Request failed with status code ${res.status}`,
      response: {
        data: res.status < 404 && (await res.json()),
        status: res.status,
        statusText: res.statusText,
      },
    };
  }
  return res.json();
}

export default function FoodFormDiet({
  food,
  token,
}: {
  food: Food;
  token: string | undefined;
}) {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const date = formatISO(new Date(), { representation: "date" });
  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: "michael",
      date: date,
      meal: "1",
      food: food.id,
      quantity_input: food.data_value,
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => mutateDiet({ values: data, token }),
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        router.refresh();
        router.push(`/diet/${data.id}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
      <FormInput
        id="date"
        type="date"
        register={register("date")}
        apiErrors={apiErrors}
      />
      <FormSelect
        id="meal"
        options={mealOptions}
        register={register("meal")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="quantity_input"
        type="number"
        label={`Quantity (${food.data_measurement})`}
        register={register("quantity_input")}
        apiErrors={apiErrors}
      />
      <FormButton
        label="Add to Diet"
        loadingLabel="Add to Diet"
        loading={mutation.isLoading}
        disabled={mutation.isLoading}
      />
    </form>
  );
}
