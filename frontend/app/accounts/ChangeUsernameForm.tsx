"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormAPIError from "../../components/FormAPIError";
import FormButton from "../../components/FormButton";
import FormInput from "../../components/FormInput";
import { useUserContext } from "../../contexts/newUserContext";
import { API } from "../../utils/constants";

type Inputs = {
  username: string;
};

const changeUsername = async (values: Inputs, user: any) => {
  const res = await fetch(`${API}/users/change-username/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${user.access}`,
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

export default function ChangeUsernameForm() {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState([]);
  const { user, setUser } = useUserContext();
  const { register, handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: (data: Inputs) => changeUsername(data, user),
  });

  const onSubmit = (data) =>
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        setUser((prev) => {
          return { ...prev, username: data.username };
        });
        router.push(`/${data.username}`);
      },
    });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormInput
        id="username"
        type="text"
        register={register("username")}
        apiErrors={apiErrors}
      />
      <FormButton label="Save" loading={mutation.isLoading} />
    </form>
  );
}
