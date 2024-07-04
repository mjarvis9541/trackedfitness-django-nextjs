"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type SignUpFormInput = {
  name: string;
  email: string;
  username: string;
  password: string;
};

const signUp = async (values: SignUpFormInput) => {
  const res = await fetch(`${API}/users/`, {
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

export default function SignUpForm() {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: [],
    detail: "",
  });
  const { register, handleSubmit } = useForm<SignUpFormInput>();
  const mutation = useMutation({ mutationFn: signUp });

  const onSubmit = (data: SignUpFormInput) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: () => {
        router.push("/signup/email-sent");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
      <FormInput
        id="name"
        label="Full name"
        register={register("name")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="username"
        register={register("username")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="email"
        type="email"
        register={register("email")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="password"
        type="password"
        register={register("password")}
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
