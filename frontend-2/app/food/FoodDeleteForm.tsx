"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export async function deleteFood({
  foodId,
  token,
}: {
  foodId: number;
  token: string | undefined;
}) {
  const res = await fetch(`${API}/food/${foodId}/`, {
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

export default function FoodDeleteForm({
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
  const { handleSubmit } = useForm({
    defaultValues: food,
  });

  const mutation = useMutation({
    mutationFn: (values: any) => deleteFood({ foodId: food.id, token }),
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: () => {
        router.refresh();
        router.push(`/food`);
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
      <FormButton
        label="Delete"
        loadingLabel="Deleting"
        style="danger"
        disabled={mutation.isLoading}
        loading={mutation.isLoading}
      />
    </form>
  );
}
