"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

type BrandFormInput = { name: string };

async function mutateBrand() {
  const res = await fetch(`${API}/brands/`, {
    method: "POST",
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
  const { register, handleSubmit } = useForm<BrandFormInput>();
  const mutation = useMutation({
    mutationFn: mutateBrand,
  });

  const onSubmit: SubmitHandler<BrandFormInput> = (data) => {
    mutation.mutate(data, {
      onSuccess: (data) => {
        router.push(`/brands/${data.id}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError
        status={mutation?.error?.response?.data?.non_field_errors}
      />
      <FormInput
        id="name"
        register={register("name")}
        apiErrors={mutation?.error?.response?.data}
      />
      <FormButton
        label="Save"
        loadingLabel="Saving..."
        style="primary"
        loading={mutation.isLoading}
        disabled={mutation.isLoading}
      />
    </form>
  );
}
