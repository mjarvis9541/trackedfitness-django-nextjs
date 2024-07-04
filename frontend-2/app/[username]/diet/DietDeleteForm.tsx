"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DietDay } from "../[username]/diet/page";

type Inputs = {};

export async function deleteDiet({
  dietId,
  token,
}: {
  dietId: number;
  token: string | undefined;
}) {
  const res = await fetch(`${API}/diet/${dietId}/`, {
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

export default function DietDeleteForm({
  diet,
  token,
}: {
  diet: DietDay;
  token: string | undefined;
}) {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { handleSubmit } = useForm({
    defaultValues: diet,
  });

  const mutation = useMutation({
    mutationFn: (values: Inputs) =>
      deleteDiet({ dietId: diet.id, token: token }),
  });

  const onSubmit = (data: Inputs) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        router.push(`/${diet.username}/diet/${diet.date}`);
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
      <FormButton
        style="danger"
        label="Delete"
        loadingLabel="Deleting..."
        disabled={mutation.isLoading}
        loading={mutation.isLoading}
      />
    </form>
  );
}
