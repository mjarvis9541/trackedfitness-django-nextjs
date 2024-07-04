"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type BrandInput = { id: string; token: string | undefined; name: string };

async function mutateBrand({
  token,
  method,
  values,
}: {
  token: string | undefined;
  method: string;
  values: BrandInput;
}) {
  let url = `brands/`;
  if (method === "PUT") {
    url = `brands/${values.id}/`;
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

export default function BrandForm({
  brand,
  token,
}: {
  brand?: Brand;
  token: string | undefined;
}) {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { register, handleSubmit } = useForm<Brand>({
    defaultValues: brand,
  });

  const mutation = useMutation({
    mutationFn: (data: BrandInput) =>
      mutateBrand({ values: data, method: "POST", token }),
  });
  const updateMutation = useMutation({
    mutationFn: (data: BrandInput) =>
      mutateBrand({ values: data, method: "PUT", token }),
  });

  const onSubmit = (data: BrandInput) => {
    if (brand) {
      updateMutation.mutate(data, {
        onError: (error: any) => {
          setApiErrors(error.response.data);
        },
        onSuccess: (data) => {
          router.refresh();
          router.push(`/brands/${data.id}`);
        },
      });
    } else {
      mutation.mutate(data, {
        onError: (error: any) => {
          setApiErrors(error.response.data);
        },
        onSuccess: (data) => {
          router.refresh();
          router.push(`/brands/${data.id}`);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
      <FormInput id="name" register={register("name")} apiErrors={apiErrors} />
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
