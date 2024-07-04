"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { API, mealOptions } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Food } from "./page";

type ItemInput = {
  meal: string;
  food: string;
  username: string;
  quantity_input: string;
};

async function mutateMeal({
  values,
  token,
}: {
  values: ItemInput;
  token: string | undefined;
}) {
  const res = await fetch(`${API}/items/`, {
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

export default function FoodFormMeal({
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
  const { register, handleSubmit } = useForm({
    defaultValues: {
      meal: "",
      food: food.id,
      quantity_input: food.data_value,
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => mutateMeal({ values: data, token }),
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        router.refresh();
        router.push(`/meals/${data.id}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
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
        label="Add to Meal"
        loadingLabel="Add to Meal"
        loading={mutation.isLoading}
        disabled={mutation.isLoading}
      />
    </form>
  );
}
