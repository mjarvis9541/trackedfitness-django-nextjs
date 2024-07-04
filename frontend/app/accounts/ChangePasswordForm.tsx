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
  password: string;
  new_password: string;
};

const changePassword = async (values: Inputs, user: any) => {
  const res = await fetch(`${API}/users/${user.username}/password-change/`, {
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

const ChangePasswordForm = () => {
  const router = useRouter();
  const { user } = useUserContext();
  const [apiErrors, setApiErrors] = useState([]);
  const { register, handleSubmit } = useForm<Inputs>();

  const mutation = useMutation({
    mutationFn: (data: Inputs) => changePassword(data, user),
  });

  const onSubmit = (data: Inputs) =>
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        router.push("/settings");
      },
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormInput
        id="password"
        type="password"
        register={register("password")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="new_password"
        label="new password"
        type="password"
        register={register("new_password")}
        apiErrors={apiErrors}
      />
      <FormButton loading={mutation.isLoading} />
    </form>
  );
};

export default ChangePasswordForm;
