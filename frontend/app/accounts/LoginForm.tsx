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
  email: string;
  password: string;
};

const login = async (values: Inputs) => {
  const res = await fetch(`${API}/auth/token/`, {
    method: "POST",
    credentials: "include",
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

export default function LoginForm() {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState([]);
  const { setUser } = useUserContext();
  const { register, handleSubmit } = useForm<Inputs>();

  const mutation = useMutation({
    mutationFn: login,
  });

  const onSubmit = (data: Inputs) => {
    mutation.mutate(data, {
      onError: (error) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        const interval = Math.floor(data.access_exp - Date.now() - 10000);
        setUser({
          initials: data.initials,
          username: data.username,
          email: data.email,
          full_name: data.full_name,
          access: data.access,
          access_exp: data.access_exp,
          refresh_exp: data.refresh_exp,
          last_login: data.last_login,
          interval: interval,
        });
        localStorage.setItem("refresh", data.refresh_exp);
        router.push(`/${data.username}`);
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
      <FormInput
        id="password"
        type="password"
        register={register("password")}
        apiErrors={apiErrors}
      />
      <FormButton label="Log in" loading={mutation.isLoading} />
    </form>
  );
}
