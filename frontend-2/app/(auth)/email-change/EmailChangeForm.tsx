"use client";

import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import ServerError from "@/components/ServerError";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type EmailChangeFormInput = { email: string };

async function mutateEmail({
  values,
  token,
}: {
  values: EmailChangeFormInput;
  token: string | undefined;
}) {
  const res = await fetch(`${API}/users/email-change/`, {
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

export default function EmailChangeForm({ token }: { token?: string }) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<EmailChangeFormInput>();

  const mutation = useMutation(mutateEmail);

  const onSubmit = (values: EmailChangeFormInput) => {
    mutation.mutate(values, {
      onSuccess: () => {
        router.push("/email-change/email-sent");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ServerError error={mutation.error} field="non_field_errors" />
      <ServerError error={mutation.error} field="detail" />
      <FormInput
        id="email"
        type="email"
        register={register("email")}
        apiErrors={mutation.error}
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
