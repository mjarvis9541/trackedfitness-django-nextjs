"use client";

import FormButton from "@/components/FormButton";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

async function addFood({ values, token }: { values: any; token: string }) {
  const res = await fetch(`${API}/diet/`, {
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

export default function DietAddFoodListItem({
  username,
  date,
  token,
  meal,
  food,
}: {
  token: string | undefined;
  username: string;
  date: string;
  meal: string;
  food: any;
}) {
  const [state, setState] = useState(food);
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: username,
      date: date,
      meal: meal,
      food: food.id,
      quantity_input: food.added_to_diary_last_quantity || food.data_value,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => addFood({ values: data, token: token }),
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data, {
      onError: (error: any) => {
        setApiErrors(error.response.data);
      },
      onSuccess: (data) => {
        router.refresh();
        router.push(`/${username}/diet/${date}`);
      },
    });
  };

  return (
    <form className="contents" onSubmit={handleSubmit(onSubmit)}>
      <input className="hidden" {...register("food")} />
      <Link
        className="col-span-4 flex items-center justify-start truncate p-2 font-bold hover:bg-gray-200 md:col-span-3 md:border-b-[1px] md:font-normal"
        href={`/food/${food.id}`}
      >
        {food.name}, {food.brand_name}
      </Link>
      <div className="col-span-4 flex items-center justify-end p-2 md:col-span-1 md:border-b-[1px]">
        <input
          className="mr-2 block w-full rounded border border-gray-300 px-2 py-1"
          type="number"
          step={food.data_measurement === "srv" ? 0.1 : 1}
          {...register("quantity_input")}
        />
        <span>{food.data_measurement}</span>
      </div>

      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Calories
      </div>
      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Protein
      </div>
      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Carbs
      </div>
      <div className="flex justify-end pt-2 pl-2 pr-2 text-sm md:hidden">
        Fat
      </div>

      <div className="flex items-center justify-end p-2 md:border-b-[1px]">
        {state.energy}kcal
      </div>
      <div className="flex items-center justify-end p-2 md:border-b-[1px]">
        {state.protein}g
      </div>
      <div className="flex items-center justify-end p-2 md:border-b-[1px]">
        {state.carbohydrate}g
      </div>
      <div className="flex items-center justify-end p-2 md:border-b-[1px]">
        {state.fat}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {state.saturates}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {state.sugars}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {state.fibre}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {state.salt}g
      </div>
      <div className="col-span-4 flex items-center justify-end border-b-[1px] md:col-span-1">
        <FormButton
          label="Add"
          loadingLabel="Add"
          disabled={mutation.isLoading}
          loading={mutation.isLoading}
        />
      </div>
    </form>
  );
}
