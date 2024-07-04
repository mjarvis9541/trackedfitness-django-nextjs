"use client";

import FormAPIError from "@/components/FormAPIError";
import FormButton from "@/components/FormButton";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { API, servingOptions } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { BrandSelect } from "./create/page";
import { Food } from "./page";

type FoodInput = {
  id: number;
  name: string;
  brand: number;
  serving: string;
  energy: number;
  fat: string;
  saturates: string;
  carbohydrate: string;
  sugars: string;
  protein: string;
  fibre: string;
  salt: string;
};

async function mutateFood({
  method,
  values,
  token,
}: {
  method: string;
  values: FoodInput;
  token: string | undefined;
}) {
  let url = `food/`;
  if (method === "PUT") {
    url = `food/${values.id}/`;
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

export default function FoodForm({
  food,
  token,
  brandSelect,
}: {
  food?: Food;
  token: string | undefined;
  brandSelect: BrandSelect[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { register, handleSubmit } = useForm<FoodInput>({
    defaultValues: food,
  });
  const mutation = useMutation({
    mutationFn: (data: FoodInput) =>
      mutateFood({ values: data, method: "POST", token }),
  });
  const updateMutation = useMutation({
    mutationFn: (data: FoodInput) =>
      mutateFood({ values: data, method: "PUT", token }),
  });

  const onSubmit = (data: FoodInput) => {
    if (food) {
      updateMutation.mutate(data, {
        onError: (error: any) => {
          setApiErrors(error.response.data);
        },
        onSuccess: (data) => {
          startTransition(() => {
            router.refresh();
          });
          router.push(`/food/${data.id}`);
        },
      });
    } else {
      mutation.mutate(data, {
        onError: (error: any) => {
          setApiErrors(error.response.data);
        },
        onSuccess: (data) => {
          startTransition(() => {
            router.refresh();
          });
          router.push(`/food/${data.id}`);
        },
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormInput
        id="name"
        type="text"
        register={register("name")}
        apiErrors={apiErrors}
      />
      <FormSelect
        id="brand"
        options={brandSelect.map((brand: BrandSelect) => ({
          value: brand.id,
          display: brand.name_with_count,
        }))}
        register={register("brand")}
        apiErrors={apiErrors}
      />
      <FormSelect
        id="serving"
        register={register("serving")}
        options={servingOptions}
      />
      <FormInput
        id="energy"
        label="Calories (kcal)"
        type="number"
        register={register("energy")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="fat"
        label="Fat (g)"
        type="number"
        step={0.1}
        register={register("fat")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="saturates"
        label="Saturates (g)"
        type="number"
        step={0.1}
        register={register("saturates")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="carbohydrate"
        label="Carbohydrate (g)"
        type="number"
        step={0.1}
        register={register("carbohydrate")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="sugars"
        label="Sugars (g)"
        type="number"
        step={0.1}
        register={register("sugars")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="fibre"
        label="Fibre (g)"
        type="number"
        step={0.1}
        register={register("fibre")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="protein"
        type="number"
        step={0.1}
        register={register("protein")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="salt"
        label="Salt (g)"
        type="number"
        step={0.01}
        register={register("salt")}
        apiErrors={apiErrors}
      />
      <FormButton
        label={!food ? "Create Food" : "Update Food"}
        loadingLabel={!food ? "Creating..." : "Updating..."}
        style="primary"
        disabled={mutation.isLoading || updateMutation.isLoading}
        loading={mutation.isLoading || updateMutation.isLoading}
      />
    </form>
  );
}
