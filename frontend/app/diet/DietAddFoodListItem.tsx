"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function DietAddFoodListItem({
  username,
  date,
  meal,
  data,
  onSubmit,
  createDiet,
}) {
  const [state, setState] = useState(data);
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      username: username,
      date: date,
      meal: meal,
      food: data.id,
      quantity_input: data.added_to_diary_last_quantity || data.data_value,
    },
  });

  useEffect(() => {
    if (!data) return;
    const dm = data.data_measurement;
    let quantity;
    if (dm === "g" || dm === "ml") {
      quantity = Number(watch(`quantity_input`) * 0.01);
    } else {
      quantity = Number(watch(`quantity_input`));
    }
    setState({
      energy: Number(data.energy * quantity).toFixed(0),
      protein: Number(data.protein * quantity).toFixed(1),
      carbohydrate: Number(data.carbohydrate * quantity).toFixed(1),
      fat: Number(data.fat * quantity).toFixed(1),
      saturates: Number(data.saturates * quantity).toFixed(1),
      sugars: Number(data.sugars * quantity).toFixed(1),
      fibre: Number(data.fibre * quantity).toFixed(1),
      salt: Number(data.salt * quantity).toFixed(2),
    });
  }, [data, watch(`quantity_input`)]);

  return (
    <form className="contents" onSubmit={handleSubmit(onSubmit)}>
      <input className="hidden" {...register("food")} />
      <Link
        className="col-span-4 flex items-center justify-start p-2 font-bold hover:bg-gray-100 md:col-span-3 md:border-b-[1px] md:font-normal"
        href={`/food/${data.id}`}
      >
        {data.name}, {data.brand_name}
      </Link>
      <div className="col-span-4 flex items-center justify-end p-2 md:col-span-1 md:border-b-[1px]">
        <input
          className="mr-2 block w-full rounded-md border border-gray-300 px-2 py-1"
          type="number"
          step={data.data_measurement === "srv" ? 0.1 : 1}
          {...register("quantity_input")}
        />
        <span>{data.data_measurement}</span>
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
        {state.energy} kcal
      </div>
      <div className="flex items-center justify-end p-2 md:border-b-[1px]">
        {state.protein} g
      </div>
      <div className="flex items-center justify-end p-2 md:border-b-[1px]">
        {state.carbohydrate} g
      </div>
      <div className="flex items-center justify-end p-2 md:border-b-[1px]">
        {state.fat} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {state.saturates} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {state.sugars} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {state.fibre} g
      </div>
      <div className="hidden items-center justify-end border-b-[1px] p-2 md:flex">
        {state.salt} g
      </div>
      <div className="col-span-4 flex items-center justify-end border-b-[1px] p-2 md:col-span-1">
        <button
          type="submit"
          disabled={createDiet.isLoading}
          className="rounded bg-gray-500 px-4 py-2 text-gray-100 hover:bg-amber-400"
        >
          Add
        </button>
      </div>
    </form>
  );
}
