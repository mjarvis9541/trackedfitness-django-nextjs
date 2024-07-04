"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

type Inputs = {
  name: string;
};

async function mutateDietSettings({
  values,
  token,
}: {
  values: Inputs;
  token: string | undefined;
}) {
  const res = await fetch(`${API}/diet-settings/`, {
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

export default function DietSettingsForm({ token }: { token: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { register, handleSubmit } = useForm<Inputs>();

  const mutation = useMutation({
    mutationFn: (values: Inputs) => mutateDietSettings({ values, token }),
  });

  const onSubmit = (values: Inputs) => {
    mutation.mutate(values, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        startTransition(() => {
          router.refresh();
        });
        router.push(`/food/${data.id}`);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormInput id="name" register={register("name")} apiErrors={apiErrors} />
      <FormButton
        label="Save"
        loadingLabel="Save"
        style="primary"
        loading={mutation.isLoading}
        disabled={mutation.isLoading}
      />
    </form>
  );
}
