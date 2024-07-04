"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Progress } from "./page";

export async function deleteProgress({
  progressId,
  token,
}: {
  progressId: number;
  token: string | undefined;
}) {
  const res = await fetch(`${API}/progress/${progressId}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res;
}

export default function ProgressDeleteForm({
  progress,
}: {
  progress: Progress;
}) {
  const router = useRouter();

  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { handleSubmit } = useForm({
    defaultValues: progress,
  });

  const mutation = useMutation({
    mutationFn: (values) =>
      deleteProgress({ progressId: progress.id, token: token }),
  });

  const onSubmit = (data) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        router.refresh();
        router.push(`/progress`);
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
      <FormButton
        label="Delete"
        loadingLabel="Deleting..."
        style="danger"
        disabled={mutation.isLoading}
        loading={mutation.isLoading}
      />
    </form>
  );
}
