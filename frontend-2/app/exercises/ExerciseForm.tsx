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
  slug: string;
};

async function createExercise({
  values,
  token,
}: {
  values: Inputs;
  token: string | undefined;
}) {
  const res = await fetch(`${API}/exercises/`, {
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

export default function ExerciseForm({ token }: { token: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const mutation = useMutation({
    mutationFn: (values: Inputs) => createExercise({ values, token: token }),
  });

  const onSubmit = (data: Inputs) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        reset();
        startTransition(() => {
          router.refresh();
        });
        router.push("/exercises");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
      <FormInput id="name" register={register("name")} apiErrors={apiErrors} />
      <FormButton disabled={mutation.isLoading} loading={mutation.isLoading} />
    </form>
  );
}
