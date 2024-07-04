"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import FormAPIError from "../../components/FormAPIError";
import { UserContext } from "../../contexts/UserContext";
import { API } from "../../utils/constants";

export default function DietTargetForm({ data }) {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [error, setError] = useState({});
  const { register, handleSubmit, setValue } = useForm({ defaultValues: data });

  const mutation = useMutation({
    mutationFn: async (values) => {
      setError({});
      const res = await fetch(`${API}/targets/${user.username}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${user?.access}`,
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
    },
    onSuccess: (data) => {
      router.push(`/diet-targets`);
    },
    onError: (error) => {
      setError(error.response.data);
    },
  });

  return (
    <form onSubmit={handleSubmit(mutation.mutate)} className="space-y-4">
      <FormAPIError status={error?.non_field_errors} />

      <div>
        <label htmlFor="weight">Body Weight (kg)</label>
        <input
          id="weight"
          type="number"
          autoFocus
          autoComplete="off"
          className="mt-1 w-full rounded border p-2"
          {...register("weight")}
        />
        <FormAPIError status={error?.weight} />
      </div>

      <div>
        <label htmlFor="protein_per_kg">Protein (grams per kg)</label>
        <input
          id="protein_per_kg"
          type="number"
          autoComplete="off"
          className="mt-1 w-full rounded border p-2"
          {...register("protein_per_kg")}
        />
        <span className="text-sm text-gray-400">
          Recommended between 2-3g per kg.
        </span>
        <FormAPIError status={error?.protein_per_kg} />
      </div>

      <div>
        <label htmlFor="carbohydrate_per_kg">Carbohydrate (grams per kg)</label>
        <input
          id="carbohydrate_per_kg"
          type="number"
          autoComplete="off"
          className="mt-1 w-full rounded border p-2"
          {...register("carbohydrate_per_kg")}
        />
        <span className="text-sm text-gray-400">
          Recommended between 1-10g per kg (fill the rest of your calories with
          carbohydrate).
        </span>
        <FormAPIError status={error?.carbohydrate_per_kg} />
      </div>

      <div>
        <label htmlFor="fat_per_kg">Fat (grams per kg)</label>
        <input
          id="fat_per_kg"
          type="number"
          autoComplete="off"
          className="mt-1 w-full rounded border p-2"
          {...register("fat_per_kg")}
        />
        <span className="text-sm text-gray-400">
          Recommended between 0.5-1g per kg.
        </span>
        <FormAPIError status={error?.fat_per_kg} />
      </div>

      <button
        type="submit"
        className="rounded border bg-gray-100 py-2 px-4 hover:bg-gray-300"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? "Loading..." : "Update"}
      </button>
    </form>
  );
}
