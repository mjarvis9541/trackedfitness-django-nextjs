"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormAPIError from "../../components/FormAPIError";
import FormButton from "../../components/FormButton";
import FormInput from "../../components/FormInput";
import { useUserContext } from "../../contexts/UserContext";
import { API } from "../../utils/constants";

type Inputs = {
  email_change_request: string;
};

const changeEmail = async (values: Inputs, user: any) => {
  const res = await fetch(`${API}/users/email-change/`, {
    method: "POST",
    headers: {
      Authorization: `JWT ${user.access}`,
      "Content-Type": "application/json",
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
};

export default function ChangeEmailForm() {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState([]);
  const { register, handleSubmit } = useForm<Inputs>();
  const { user } = useUserContext();

  const mutation = useMutation({
    mutationFn: (data: Inputs) => changeEmail(data, user),
  });

  const onSubmit = (data: Inputs) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: () => {
        router.push("/settings/change-email-email-sent");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormInput
        id="email_change_request"
        label="New email"
        type="text"
        register={register("email_change_request")}
        apiErrors={apiErrors}
      />
      <FormButton label="Continue" loading={mutation.isLoading} />
    </form>
  );
}
