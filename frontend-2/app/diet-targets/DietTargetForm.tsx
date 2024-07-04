"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Target } from "./page";

type Inputs = {
  weight: number;
  protein_per_kg: number;
  carbohydrate_per_kg: number;
  fat_per_kg: number;
};

async function mutateDietTarget({
  values,
  token,
}: {
  values: Inputs;
  token: string | undefined;
}) {
  const res = await fetch(`${API}/targets/${values.username}/`, {
    method: "PUT",
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

export default function DietTargetForm({
  dietTarget,
  token,
}: {
  dietTarget: Target;
  token: string | undefined;
}) {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: dietTarget,
  });

  console.log(dietTarget.protein);

  const mutation = useMutation({
    mutationFn: (data: Inputs) =>
      mutateDietTarget({ values: data, token: token }),
  });

  const onSubmit = (data: Inputs) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: () => {
        router.refresh();
        router.push("/diet-targets");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormInput
        id="weight"
        label="Weight (kg)"
        register={register("weight")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="protein_per_kg"
        label="Protein (grams per kg)"
        register={register("protein_per_kg")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="carbohydrate_per_kg"
        label="Carbohydrate (grams per kg)"
        register={register("carbohydrate_per_kg")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="fat_per_kg"
        label="Fat (grams per kg)"
        register={register("fat_per_kg")}
        apiErrors={apiErrors}
      />
      <FormButton
        label="Update Targets"
        loadingLabel="Updating Targets..."
        style="primary"
        disabled={mutation.isLoading}
        loading={mutation.isLoading}
      />
    </form>
  );
}
