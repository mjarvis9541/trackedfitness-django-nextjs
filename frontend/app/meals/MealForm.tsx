import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormAPIError from "../../components/FormAPIError";
import useCreateMeal from "./useCreateMeal";
import useUpdateMeal from "./useUpdateMeal";

const MealForm = ({ data }) => {
  const router = useRouter();
  const { id } = router.query;
  const [apiErrors, setApiErrors] = useState([]);

  const { register, handleSubmit } = useForm({ defaultValues: data });

  const createMealMutation = useCreateMeal();
  const updateMealMutation = useUpdateMeal({ id });

  const onSubmit = (data) => {
    if (!id) {
      createMealMutation.mutate(data, {
        onSuccess: (data) => {
          router.push(`/meals/${data.id}`);
        },
        onError: (error) => {
          setApiErrors(error.response.data);
        },
      });
    }

    if (id) {
      updateMealMutation.mutate(data, {
        onSuccess: (data) => {
          router.push(`/meals/${data.id}`);
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

      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          className="w-full rounded border p-2"
          {...register("name")}
        />
        <FormAPIError status={apiErrors?.name} />
      </div>

      <button
        type="submit"
        className="rounded bg-gray-100 py-2 px-4 hover:bg-gray-200"
        disabled={updateMealMutation.isLoading || createMealMutation.isLoading}
      >
        {updateMealMutation.isLoading || createMealMutation.isLoading
          ? "Saving..."
          : "Save"}
      </button>
    </form>
  );
};

export default MealForm;
