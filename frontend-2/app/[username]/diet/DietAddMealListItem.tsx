"use client";

import FormButton from "@/components/FormButton";
import { API } from "@/utils/constants";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type CreateFromMealInput = {
  username: string;
  date: string;
  meal: string;
  saved_meal: number;
};

async function addMeal({ values, token }: { values: any; token: string }) {
  const res = await fetch(`${API}/diet/create-from-meal/`, {
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

export default function DietAddMealListItem({
  username,
  date,
  token,
  dietMeal,
  meal,
}: {
  token: string | undefined;
  username: string;
  date: string;
  dietMeal: string;
  meal: Meal;
}) {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState({
    non_field_errors: "",
    detail: "",
  });
  const { register, handleSubmit } = useForm<CreateFromMealInput>({
    defaultValues: {
      username: username,
      date: date,
      meal: dietMeal,
      saved_meal: meal.id,
    },
  });
  const mutation = useMutation({
    mutationFn: (data: any) => addMeal({ values: data, token: token }),
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
      <Link
        href={`/meals/${meal.id}`}
        className="col-span-3 flex items-center justify-start truncate p-2 hover:bg-gray-200 md:col-span-1 md:border-b-[1px] md:bg-transparent"
      >
        {meal.name}
      </Link>
      <Link
        href={`/${meal.created_by_username}`}
        className="hidden items-center justify-end border-b-[1px] p-2 hover:bg-gray-200 md:flex"
      >
        {meal.created_by_username}
      </Link>
      <div className="flex items-center justify-end p-2 md:border-b-[1px] md:bg-transparent">
        {meal.food_count}
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
        {meal.energy}kcal
      </div>
      <div className="flex items-center justify-end p-2 md:border-b-[1px]">
        {meal.protein}g
      </div>
      <div className="flex items-center justify-end p-2 md:border-b-[1px]">
        {meal.carbohydrate}g
      </div>
      <div className="flex items-center justify-end p-2 md:border-b-[1px]">
        {meal.fat}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {meal.saturates}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {meal.sugars}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {meal.fibre}g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {meal.salt}g
      </div>
      <div className="col-span-4 flex items-center justify-end border-b-[1px] p-1 md:col-span-1">
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
