import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import FormAPIError from "../../components/FormAPIError";
import { UserContext } from "../../contexts/UserContext";
import MealSelectForm from "./MealSelectForm";
import useCreateMealItemFromFoodDetail from "./useCreateMealItemFromFoodDetail";

const MealFoodDetailForm = ({ food }) => {
  const router = useRouter();
  const {
    user: { username },
  } = useContext(UserContext);

  const [apiErrors, setApiErrors] = useState([]);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      meal: "",
      food: food.id,
      quantity_input: food.data_value,
    },
  });

  const createMutation = useCreateMealItemFromFoodDetail();

  const onSubmit = (data) => {
    createMutation.mutate(data, {
      onSuccess: (data) => {
        router.push(`/meals/${data.meal}`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormAPIError status={apiErrors?.non_field_errors} />
        <FormAPIError status={apiErrors?.detail} />

        <div>
          <label htmlFor="saved_meal">Meal</label>
          <MealSelectForm register={register} />
          <FormAPIError status={apiErrors?.meal} />
        </div>

        <div>
          <label htmlFor="quantity_input">
            Quantity ({food.data_measurement})
          </label>
          <input
            id="quantity_input"
            step="1"
            type="number"
            className="w-full rounded border p-2"
            {...register("quantity_input")}
          />
          <FormAPIError status={apiErrors?.quantity_input} />
        </div>

        <button
          type="submit"
          className="rounded border bg-gray-100 py-2 px-4 hover:bg-gray-200"
          disabled={createMutation.isLoading}
        >
          {createMutation.isLoading ? "Saving..." : "Add to Meal"}
        </button>
      </form>
    </>
  );
};

export default MealFoodDetailForm;
