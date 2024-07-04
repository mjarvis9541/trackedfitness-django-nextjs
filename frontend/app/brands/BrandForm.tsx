"use client";

import { useRouter } from "next/router";
import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormAPIError from "../../components/FormAPIError";
import FormButton from "../../components/FormButton";
import FormInput from "../../components/FormInput";
import useCreateBrand from "./useCreateBrand";
import useUpdateBrand from "./useUpdateBrand";

type BrandObject = {
  data: {
    id: number;
    name: string;
    slug: string;
    created_by_username: string;
    food_count: number;
    created_at: Date;
    updated_at: Date;
    url: string;
  };
};

type Input = {
  name: string;
};

const BrandForm: FC<BrandObject> = ({ data }) => {
  const router = useRouter();
  const { id } = router.query;
  const [apiErrors, setApiErrors] = useState([]);

  const { register, handleSubmit, watch } = useForm<Input>({
    defaultValues: data,
  });

  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand({ id });

  const onSubmit: SubmitHandler<Input> = (data: Input) => {
    if (!id) {
      createMutation.mutate(data, {
        onSuccess: (data) => {
          router.push(`/brands/${data.id}`);
        },
        onError: (error) => {
          setApiErrors(error.response.data);
        },
      });
    } else {
      updateMutation.mutate(data, {
        onSuccess: (data) => {
          router.push(`/brands/${data.id}`);
        },
        onError: (error) => {
          setApiErrors(error.response.data);
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormAPIError status={apiErrors?.detail} />

      <FormInput
        id="name"
        label="Name"
        type="text"
        register={register("name")}
        apiErrors={apiErrors}
      />

      <FormButton
        label="Save"
        loadingLabel="Saving..."
        loading={updateMutation.isLoading || createMutation.isLoading}
      />
    </form>
  );
};

export default BrandForm;
