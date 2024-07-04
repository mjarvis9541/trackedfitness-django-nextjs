"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

async function mutateUserFollowing({
  values,
  token,
}: {
  values: any;
  token: string | undefined;
}) {
  const res = await fetch(`${API}/user-followings/`, {
    method: "POST",
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

export default function UserFollowForm({
  userId,
  token,
}: {
  userId: string;
  token: string | undefined;
}) {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: () =>
      mutateUserFollowing({
        token: token,
        values: { following: userId },
      }),
  });

  const onSubmit = (data) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        router.refresh();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
      <FormButton
        label="Follow"
        loadingLabel="Follow"
        loading={mutation.isLoading}
        disabled={mutation.isLoading}
      />
    </form>
  );
}
