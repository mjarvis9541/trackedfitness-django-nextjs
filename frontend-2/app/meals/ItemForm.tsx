"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type ItemInput = {
  id: string;
  quantity_input: string;
  token: string | undefined;
};

async function mutateItem({
  values,
  token,
}: {
  values: ItemInput;
  token: string | undefined;
}) {
  const res = await fetch(`${API}/items/${values.id}/`, {
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

export default function ItemForm({
  mealItem,
  token,
}: {
  mealItem?: any;
  token: string | undefined;
}) {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { register, handleSubmit } = useForm<ItemInput>({
    defaultValues: mealItem,
  });

  const mutation = useMutation({
    mutationFn: (values: ItemInput) => mutateItem({ values, token }),
  });

  const onSubmit = (values: ItemInput) => {
    mutation.mutate(values, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        router.push(`/meals/${data.meal}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
      <FormInput
        id="quantity_input"
        label={`Quantity (${mealItem.data_measurement})`}
        register={register("quantity_input")}
        apiErrors={apiErrors}
      />
      <FormButton
        label="Update"
        loadingLabel="Updating..."
        style="primary"
        loading={mutation.isLoading}
        disabled={mutation.isLoading}
      />
    </form>
  );
}
