"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormAPIError from "../../components/FormAPIError";
import FormButton from "../../components/FormButton";
import FormInput from "../../components/FormInput";
import { API } from "../../utils/constants";

type Inputs = {
  email: string;
};

const resendActivation = async (values: Inputs) => {
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
};

export default function ResendActivationForm() {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState([]);
  const { register, handleSubmit } = useForm<Inputs>();

  const mutation = useMutation({
    mutationFn: resendActivation,
  });

  const onSubmit = (data: Inputs) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: () => {
        router.push("/signup-email-sent");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormInput
        id="email"
        type="email"
        register={register("email")}
        apiErrors={apiErrors}
      />
      <FormButton loading={mutation.isLoading} />
    </form>
  );
}
