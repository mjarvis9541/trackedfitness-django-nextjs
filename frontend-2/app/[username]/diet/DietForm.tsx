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
import { DietDay } from "../[username]/diet/page";

type DietInput = {
  id: number;
  date: string;
  quantity_input: string;
  meal: string;
};

async function mutateDiet({
  method,
  values,
  token,
}: {
  method: string;
  values: DietInput;
  token: string | undefined;
}) {
  let url = `diet/`;
  if (method === "PUT") {
    url = `diet/${values.id}/`;
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

export default function DietForm({
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
  const { register, handleSubmit } = useForm<DietInput>({
    defaultValues: { ...diet, quantity_input: diet.data_value },
  });

  const mutation = useMutation({
    mutationFn: (data: DietInput) =>
      mutateDiet({ values: data, method: "POST", token }),
  });
  const updateMutation = useMutation({
    mutationFn: (data: DietInput) =>
      mutateDiet({ values: data, method: "PUT", token }),
  });
  const onSubmit = (data: DietInput) => {
    if (diet) {
      updateMutation.mutate(data, {
        onError: (error: any) => {
          setApiErrors(error.response.data);
        },
        onSuccess: (data) => {
          router.refresh();
          router.push(`/${data.username}/diet/${data.date}`);
        },
      });
    } else {
      mutation.mutate(data, {
        onError: (error: any) => {
          setApiErrors(error.response.data);
        },
        onSuccess: (data) => {
          router.refresh();
          router.push(`/${data.username}/diet/${data.date}`);
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
        label={`Quantity (${diet.data_measurement})`}
        register={register("quantity_input")}
        apiErrors={apiErrors}
      />
      <FormButton
        label="Update Diet Entry"
        loadingLabel="Updating Diet Entry..."
        style="primary"
        loading={mutation.isLoading || updateMutation.isLoading}
        disabled={mutation.isLoading || updateMutation.isLoading}
      />
    </form>
  );
}
