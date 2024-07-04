"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DietDay } from "../../../page";

type DietCopyPreviousInput = {
  from_date: string;
  from_meal: string;
  date: string;
  meal: string;
  username: string;
};

async function dietCopyPrevious({
  values,
  token,
}: {
  values: DietCopyPreviousInput;
  token: string | undefined;
}) {
  const res = await fetch(`${API}/diet/create-from-date-meal/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify(values),
  });
}

export default function DietCopyPreviousForm({
  dietDayList,
  fromDate,
  fromMeal,
  toDate,
  toMeal,
  token,
  username,
}: {
  dietDayList: DietDay[];
  fromDate: string;
  fromMeal: string;
  toDate: string;
  toMeal: string;
  token: string | undefined;
  username: string;
}) {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { handleSubmit } = useForm<DietCopyPreviousInput>({
    defaultValues: {
      from_date: fromDate,
      from_meal: fromMeal,
      date: toDate,
      meal: toMeal,
      username,
    },
  });
  const mutation = useMutation({
    mutationFn: (values: DietCopyPreviousInput) =>
      dietCopyPrevious({ values, token }),
  });

  const onSubmit = (values: DietCopyPreviousInput) => {
    mutation.mutate(values, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: () => {
        router.refresh();
        router.push(`/${username}/diet/${toDate}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
      <FormButton
        label="Copy"
        loadingLabel="Copying..."
        style="primary"
        disabled={!dietDayList.length || mutation.isLoading}
        loading={mutation.isLoading}
      />
    </form>
  );
}
