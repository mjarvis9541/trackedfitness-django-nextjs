"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import authClientFetch from "@/utils/auth-client-fetch";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function UserUnfollowForm({
  userId,
  token,
}: {
  userId: string;
  token: string | undefined;
}) {
  const router = useRouter();
  const { handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: () =>
      authClientFetch({
        url: `user-followings/`,
        method: "DELETE",
        token: token,
        values: { following: userId },
      }),
  });

  const onSubmit = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        router.refresh();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormAPIError
        status={mutation?.error?.response?.data?.non_field_errors}
      />
      <FormAPIError status={mutation?.error?.response?.data?.detail} />
      <FormButton
        label="Unfollow"
        loadingLabel="Unfollow"
        loading={mutation.isLoading}
        disabled={mutation.isLoading}
      />
    </form>
  );
}
