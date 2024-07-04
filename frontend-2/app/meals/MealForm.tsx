"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type MealInput = { id: number; token: string | undefined; name: string };

async function mutateMeal({
  method,
  values,
  token,
}: {
  method: string;
  values: MealInput;
  token: string | undefined;
}) {
  let url = `meals/`;
  if (method === "PUT") {
    url = `meals/${values.id}/`;
  }
  const res = await fetch(`${API}/${url}`, {
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

export default function MealForm({
  meal,
  token,
}: {
  meal?: Meal;
  token: string | undefined;
}) {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { register, handleSubmit } = useForm<MealInput>({
    defaultValues: meal,
  });

  const mutation = useMutation({
    mutationFn: (data: MealInput) =>
      mutateMeal({ values: data, method: "POST", token: token }),
  });
  const updateMutation = useMutation({
    mutationFn: (data: MealInput) =>
      mutateMeal({ values: data, method: "PUT", token: token }),
  });

  const onSubmit = (data: MealInput) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        router.push(`/meals/${data.id}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormInput id="name" register={register("name")} apiErrors={apiErrors} />
      <FormButton
        label="Save"
        loadingLabel="Saving..."
        style="primary"
        disabled={mutation.isLoading || updateMutation.isLoading}
        loading={mutation.isLoading || updateMutation.isLoading}
      />
    </form>
  );
}
