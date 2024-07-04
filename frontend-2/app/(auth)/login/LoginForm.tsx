"use client";

import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import ServerError from "@/components/ServerError";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

type LoginFormInput = {
  email: string;
  password: string;
};

async function login(values: LoginFormInput) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    throw await res.json();
  }
  return res.json();
}

export default function LoginForm() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginFormInput>();

  const mutation = useMutation(login);

  const onSubmit: SubmitHandler<LoginFormInput> = (values) => {
    mutation.mutate(values, {
      onSuccess: ({ username }) => router.push(`/${username}`),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ServerError error={mutation.error} field="non_field_errors" />
      <ServerError error={mutation.error} field="detail" />

      <FormInput
        id="email"
        type="email"
        register={register("email")}
        apiErrors={mutation.error}
      />
      <FormInput
        id="password"
        type="password"
        register={register("password")}
        apiErrors={mutation.error}
      />
      <FormButton label="Log in" loadingLabel="Logging in..." style="primary" />
    </form>
  );
}
