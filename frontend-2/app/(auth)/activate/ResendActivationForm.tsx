"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type ResendActivationFormInput = {
  email: string;
};

async function resendActivation(values: ResendActivationFormInput) {
  const res = await fetch(`${API}/users/resend-activation-email/`, {
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

export default function ResendActivationForm() {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { register, handleSubmit } = useForm<ResendActivationFormInput>();

  const mutation = useMutation({
    mutationFn: resendActivation,
  });

  const onSubmit = (values: ResendActivationFormInput) => {
    mutation.mutate(values, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: () => {
        router.push("/activate/email-sent");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
      <FormInput
        id="email"
        type="email"
        required={true}
        register={register("email")}
        apiErrors={apiErrors}
      />
      <FormButton
        label="Verify Email"
        loadingLabel="Sending..."
        style="primary"
        disabled={mutation.isLoading}
        loading={mutation.isLoading}
      />
    </form>
  );
}
