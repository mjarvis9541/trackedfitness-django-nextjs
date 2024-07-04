"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export async function deleteMeal({
  mealId,
  token,
}: {
  mealId: number;
  token: string | undefined;
}) {
  const res = await fetch(`${API}/meals/${mealId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res;
}

export default function MealDeleteForm({
  meal,
  token,
}: {
  meal: Meal;
  token: string | undefined;
}) {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: (values) => deleteMeal({ mealId: meal.id, token }),
  });

  const onSubmit = (values: any) => {
    mutation.mutate(values, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: () => {
        router.push("/meals");
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
      <FormButton
        label="Delete"
        loadingLabel="Deleting..."
        style="danger"
        disabled={mutation.isLoading}
        loading={mutation.isLoading}
      />
    </form>
  );
}
