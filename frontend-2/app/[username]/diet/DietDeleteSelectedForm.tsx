"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

async function dietDeletedSelected({
  values,
  idList,
  token,
}: {
  values: any;
  idList: string[];
  token: string | undefined;
}) {
  const res = await fetch(`${API}/diet/delete-from-id-list/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({ username: values.username, id_list: idList }),
  });
  if (!res.ok) {
    throw new Error(`Request failed with status code ${res.status}`);
  }
  return res;
}

export default function DietDeleteSelectedForm({
  username,
  idList,
  date,
  token,
  setIsChecked,
}: {
  username: string;
  idList: any;
  date: string;
  token: string | undefined;
  setIsChecked: any;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { handleSubmit } = useForm({
    defaultValues: { username },
  });

  const mutation = useMutation({
    mutationFn: (values: any) => dietDeletedSelected({ values, idList, token }),
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        setIsChecked([]);
        startTransition(() => {
          router.refresh();
        });
        // router.push(`/${username}/diet/${date}`);
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
      <FormButton
        label="Delete"
        loadingLabel="Deleting..."
        disabled={idList.length === 0 || mutation.isLoading}
        loading={mutation.isLoading}
      />
    </form>
  );
}
