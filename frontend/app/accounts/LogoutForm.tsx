"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormAPIError from "../../components/FormAPIError";
import FormButton from "../../components/FormButton";
import { useUserContext } from "../../contexts/UserContext";
import { API } from "../../utils/constants";

const logout = async () => {
  const res = await fetch(`${API}/auth/logout/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
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

export default function LogoutForm() {
  const router = useRouter();
  const { setUser } = useUserContext();
  const [apiErrors, setApiErrors] = useState([]);
  const { handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: logout,
  });

  const onSubmit = (data) => {
    mutation.mutate(data, {
      onError: (error) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        setUser({});
        localStorage.removeItem("refresh");
        router.push("/login");
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormButton label="Log out" loading={mutation.isLoading} />
    </form>
  );
}
