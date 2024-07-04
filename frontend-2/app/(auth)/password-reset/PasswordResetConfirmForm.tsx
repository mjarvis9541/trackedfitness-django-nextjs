"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type PasswordResetFormInput = { email: string };

async function passwordReset({ values }: { values: PasswordResetFormInput }) {
  const res = await fetch(`${API}/users/password-reset-confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

export default function PasswordResetConfirmForm() {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { register, handleSubmit } = useForm<PasswordResetFormInput>();

  const mutation = useMutation({
    mutationFn: (values: PasswordResetFormInput) => passwordReset({ values }),
  });

  const onSubmit = (data: PasswordResetFormInput) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: () => {
        router.push("/password-reset/email-sent");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
      <FormInput
        id="email"
        register={register("email")}
        apiErrors={apiErrors}
      />
      <FormButton disabled={mutation.isLoading} loading={mutation.isLoading} />
    </form>
  );
}
