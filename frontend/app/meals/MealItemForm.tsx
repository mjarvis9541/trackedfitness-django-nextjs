import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormAPIError from "../../components/FormAPIError";
import useUpdateMealItem from "./useUpdateMealItem";

const MealItemForm = ({ data }) => {
  const router = useRouter();
  const { id } = router.query;
  const [apiErrors, setApiErrors] = useState([]);

  const { register, handleSubmit } = useForm({ defaultValues: data });

  const updateMealItem = useUpdateMealItem({
    itemId: data.id,
  });

  const onSubmit = (data) => {
    updateMealItem.mutate(data, {
      onSuccess: (data) => {
        router.push(`/meals/${id}`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />

      <div>
        <label htmlFor="quantity_input">Quantity</label>
        <input
          id="quantity_input"
          type="number"
          className="w-full rounded border p-2"
          {...register("quantity_input")}
          defaultValue={data.quantity_input}
        />
        <FormAPIError status={apiErrors?.quantity_input} />
      </div>

      <button
        type="submit"
        className="rounded bg-gray-100 py-2 px-4 hover:bg-gray-200 disabled:bg-gray-400"
        disabled={updateMealItem.isLoading}
      >
        {updateMealItem.isLoading ? "Loading..." : "Save"}
      </button>
    </form>
  );
};

export default MealItemForm;
