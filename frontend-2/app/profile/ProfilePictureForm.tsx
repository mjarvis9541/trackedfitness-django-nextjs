"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Profile } from "./page";

type Inputs = {
  id: number;
  username: string;
  goal: string;
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
  image: string;
};

async function mutateProfile({
  values,
  token,
}: {
  values: Inputs;
  token: string | undefined;
}) {
  let formData = new FormData();
  formData.append("username", values.username);
  formData.append("image", values.image[0]);
  console.log(formData);
  const res = await fetch(`${API}/profiles/${values.username}/`, {
    method: "PUT",
    headers: {
      Authorization: `JWT ${token}`,
    },
    body: formData,
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

export default function ProfilePictureForm({
  profile,
  token,
}: {
  profile: Profile;
  token: string | undefined;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: { username: profile.username, image: profile.image },
  });

  const mutation = useMutation({
    mutationFn: (values: Inputs) => mutateProfile({ values, token }),
  });

  const onSubmit = (data: Inputs) => {
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
      <FormInput
        id="image"
        label="Image"
        type="file"
        accept="image/jpeg,image/png,image/gif"
        register={register("image")}
        apiErrors={apiErrors}
      />
      <FormButton
        style="primary"
        label="Upload"
        loadingLabel="Uploading..."
        disabled={mutation.isLoading}
        loading={mutation.isLoading}
      />
    </form>
  );
}
