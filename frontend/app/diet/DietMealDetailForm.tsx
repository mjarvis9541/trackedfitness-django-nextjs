import { formatISO } from "date-fns";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "../../components/Select";
import { UserContext } from "../../contexts/UserContext";
import { mealOptions } from "../../utils/constants";
import useCreateDietFromMealDetail from "./useCreateDietFromMealDetail";

export default function DietMealDetailForm({ mealId }) {
  const {
    user: { username },
  } = useContext(UserContext);

  const router = useRouter();
  const [apiErrors, setApiErrors] = useState([]);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      username: username,
      date: formatISO(new Date(), { representation: "date" }),
      meal: "1",
      saved_meal: mealId,
    },
  });

  const createMutation = useCreateDietFromMealDetail({ username });

  const onSubmit = (data) => {
    createMutation.mutate(data, {
      onSuccess: (data) => {
        router.push(`/${username}/diet/${data.date}/`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="date">Date</label>
        <input
          className="w-full rounded border p-2"
          type="date"
          id="date"
          {...register("date")}
        />
      </div>
      <div>
        <label htmlFor="meal">Meal</label>
        <Select id="meal" register={register("meal")} options={mealOptions} />
      </div>

      <button
        className="rounded border bg-gray-100 py-2 px-4 hover:bg-gray-300"
        type="submit"
      >
        Add to Diet
      </button>
    </form>
  );
}
