"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { formatISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

async function mutateDietTargetDate({
  values,
  method,
  token,
}: {
  values: DietTargetDateInput;
  method: string;
  token: string | undefined;
}) {
  let url = `diet-targets/`;
  if (method === "PUT") {
    url = `diet-targets/${values.id}/`;
  }
  const res = await fetch(`${API}/${url}`, {
    method: method,
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

export default function DietTargetDateForm({
  date = formatISO(new Date(), { representation: "date" }),
  dietTargetDate,
  token,
}: {
  token: string | undefined;
  date?: string;
  dietTargetDate?: any;
}) {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { register, handleSubmit } = useForm<DietTargetDateInput>({
    defaultValues: {
      username: "michael",
      ...dietTargetDate,
      date:
        dietTargetDate?.date ||
        formatISO(new Date(date), { representation: "date" }),
    },
  });

  const mutation = useMutation({
    mutationFn: (data: DietTargetDateInput) =>
      mutateDietTargetDate({
        values: data,
        method: "POST",
        token: token,
      }),
  });
  const updateMutation = useMutation({
    mutationFn: (data: DietTargetDateInput) =>
      mutateDietTargetDate({
        values: data,
        method: "PUT",
        token: token,
      }),
  });

  const onSubmit = (data: DietTargetDateInput) => {
    if (dietTargetDate) {
      updateMutation.mutate(data, {
        onError: (error: any) => {
          setApiErrors(error.response.data);
        },
        onSuccess: (data) => {
          router.refresh();
          router.push(`/diet-targets-date/${data.id}`);
        },
      });
    } else {
      mutation.mutate(data, {
        onError: (error: any) => {
          setApiErrors(error.response.data);
        },
        onSuccess: (data) => {
          router.refresh();
          router.push(`/diet-targets-date/${data.id}`);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormInput
        id="date"
        type="date"
        label="Date"
        register={register("date")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="weight"
        label="Weight (kg)"
        type="number"
        step={0.1}
        register={register("weight")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="protein_per_kg"
        label="Protein (grams per kg)"
        type="number"
        step={0.01}
        register={register("protein_per_kg")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="carbohydrate_per_kg"
        label="Carbohydrate (grams per kg)"
        type="number"
        step={0.01}
        register={register("carbohydrate_per_kg")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="fat_per_kg"
        label="Fat (grams per kg)"
        type="number"
        step={0.01}
        register={register("fat_per_kg")}
        apiErrors={apiErrors}
      />

      <FormButton
        label="Save"
        loadingLabel="Saving..."
        style="primary"
        loading={mutation.isLoading || updateMutation.isLoading}
        disabled={mutation.isLoading || updateMutation.isLoading}
      />
    </form>
  );
}
