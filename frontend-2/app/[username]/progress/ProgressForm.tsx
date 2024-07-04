"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { formatISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type ProgressInput = {
  id?: number | undefined;
  date?: string | undefined;
  username?: string | undefined;
  weight?: number | undefined;
  notes?: string | undefined;
  energy_burnt?: number | undefined;
};

async function mutateProgress({
  values,
  method,
  token,
}: {
  values: ProgressInput;
  method: string;
  token: string | undefined;
}) {
  let url = `progress/`;
  if (method === "PUT") {
    url = `progress/${values.id}/`;
  }
  const res = await fetch(`${API}/${url}`, {
    method: method,
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

export default function ProgressForm({
  token,
  username,
  date = formatISO(new Date(), { representation: "date" }),
  progress,
}: {
  token: string | undefined;
  username: string;
  date?: string;
  progress?: Progress;
}) {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { register, handleSubmit } = useForm<ProgressInput>({
    defaultValues: {
      username: "michael",
      ...progress,
      date:
        progress?.date || formatISO(new Date(date), { representation: "date" }),
    },
  });

  const mutation = useMutation({
    mutationFn: (data: ProgressInput) =>
      mutateProgress({ values: data, method: "POST", token }),
  });
  const updateMutation = useMutation({
    mutationFn: (data: ProgressInput) =>
      mutateProgress({ values: data, method: "PUT", token }),
  });

  const onSubmit = (data: ProgressInput) => {
    if (progress) {
      updateMutation.mutate(data, {
        onError: (error: any) => {
          setApiErrors(error.response.data);
        },
        onSuccess: (data) => {
          router.refresh();
          router.push(`/${username}/progress/${data.date}/${data.id}`);
        },
      });
    } else {
      mutation.mutate(data, {
        onError: (error: any) => {
          setApiErrors(error.response.data);
        },
        onSuccess: (data) => {
          router.refresh();
          router.push(`/${username}/progress/${data.date}/${data.id}`);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormInput
        id="date"
        type="date"
        label="Date"
        register={register("date")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="weight"
        label="Weight (kg)"
        register={register("weight")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="estimated_energy_burnt"
        label="Energy Burnt"
        required={false}
        register={register("energy_burnt")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="notes"
        label="Notes"
        required={false}
        register={register("notes")}
        apiErrors={apiErrors}
      />
      <FormButton
        label={!progress ? "Create Progress" : "Update Progress"}
        loadingLabel={
          !progress ? "Creating Progress..." : "Updating Progress..."
        }
        style="primary"
        loading={mutation.isLoading || updateMutation.isLoading}
        disabled={mutation.isLoading || updateMutation.isLoading}
      />
    </form>
  );
}
