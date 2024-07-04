"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

export async function deleteMealItem({
  mealItemId,
  token,
}: {
  mealItemId: string;
  token: string | undefined;
}) {
  const res = await fetch(`${API}/items/${mealItemId}/`, {
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

export default function MealItemDeleteForm({
  mealId,
  mealItemId,
  token,
}: {
  mealId: string;
  mealItemId: string;
  token: string | undefined;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { handleSubmit } = useForm();
  const mutation = useMutation({
    mutationFn: () => deleteMealItem({ mealItemId, token }),
  });

  const onSubmit = (values: any) => {
    mutation.mutate(values, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: () => {
        startTransition(() => {
          router.push(`/meals/${mealId}`);
          router.refresh();
        });
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
