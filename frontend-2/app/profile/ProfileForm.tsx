"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import {
  activityLevelOptions,
  API,
  goalOptions,
  sexOptions,
} from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Profile } from "./page";

type ProfileInput = {
  id: number;
  username: string;
  goal: string;
  image: string;
  get_goal_display: string;
  activity_level: string;
  get_activity_level_display: string;
  sex: "M" | "F";
  get_sex_display: string;
  weight: string;
  height: string;
  date_of_birth: string;
  is_private: boolean;
  bmi: number;
  bmr: number;
  tdee: number;
  created_at: string;
  updated_at: string;
};

async function mutateProfile({
  values,
  token,
  isInitialSetUp,
}: {
  values: ProfileInput;
  token: string | undefined;
  isInitialSetUp: boolean | undefined;
}) {
  let url = `profiles/${values.username}/`;
  if (isInitialSetUp) {
    url += `initial-setup/`;
  }
  delete values.image;
  const res = await fetch(`${API}/${url}`, {
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

export default function ProfileForm({
  profile,
  token,
  isInitialSetUp,
}: {
  profile: Profile;
  token: string | undefined;
  isInitialSetUp?: boolean | undefined;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { register, handleSubmit } = useForm<ProfileInput>({
    defaultValues: profile,
  });

  const mutation = useMutation({
    mutationFn: (values: ProfileInput) =>
      mutateProfile({ values, token, isInitialSetUp }),
  });

  const onSubmit = (data: ProfileInput) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        startTransition(() => {
          router.refresh();
          router.push("/profile");
        });
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />
      <FormSelect
        id="goal"
        label="Goal"
        options={goalOptions}
        register={register("goal")}
        apiErrors={apiErrors}
      />
      <FormSelect
        id="activity_level"
        label="Activity Level"
        options={activityLevelOptions}
        register={register("activity_level")}
        apiErrors={apiErrors}
      />
      <FormSelect
        id="sex"
        label="Sex"
        options={sexOptions}
        register={register("sex")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="height"
        label="Height (cm)"
        register={register("height")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="weight"
        label="Weight (kg)"
        register={register("weight")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="date_of_birth"
        label="Date of Birth"
        type="date"
        register={register("date_of_birth")}
        apiErrors={apiErrors}
      />
      <FormButton
        style="primary"
        label="Update Profile"
        loadingLabel="Updating Profile..."
        disabled={mutation.isLoading}
        loading={mutation.isLoading}
      />
    </form>
  );
}
