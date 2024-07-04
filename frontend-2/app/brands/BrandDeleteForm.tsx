"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

type Inputs = {};

export async function deleteBrand({
  brandId,
  token,
}: {
  brandId: number;
  token: string | undefined;
}) {
  const res = await fetch(`${API}/brands/${brandId}/`, {
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

export default function BrandDeleteForm({
  brand,
  token,
}: {
  brand: Brand;
  token: string | undefined;
}) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { handleSubmit } = useForm({
    defaultValues: brand,
  });

  const mutation = useMutation({
    mutationFn: (values: Inputs) =>
      deleteBrand({ brandId: brand.id, token: token }),
  });

  const onSubmit = (data: Inputs) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        router.refresh();
        router.push(`/brands`);
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
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
