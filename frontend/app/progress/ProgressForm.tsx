import { formatISO } from "date-fns";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FormAPIError from "../../components/FormAPIError";
import useCreateProgress from "./useCreateProgress";
import useUpdateProgress from "./useUpdateProgress";

const ProgressForm = ({ progressData }) => {
  const router = useRouter();
  const [apiErrors, setApiErrors] = useState([]);
  const { register, handleSubmit } = useForm();
  const { username, date = formatISO(Date.now(), { representation: "date" }) } =
    router.query;

  const updateMutation = useUpdateProgress({ id: progressData?.id });
  const createMutation = useCreateProgress({ username, date });

  const onSubmit = (data) => {
    if (!progressData?.id) {
      createMutation.mutate(data, {
        onSuccess: () => {
          router.push(`/${username}/progress-month`);
        },
        onError: (error) => {
          setApiErrors(error.response.data);
        },
      });
    } else {
      updateMutation.mutate(data, {
        onSuccess: () => {
          router.push(`/${username}/progress-month/${date}`);
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
        <label htmlFor="weight">Weight (kg)</label>
        <input
          autoFocus
          id="weight"
          type="number"
          step="0.01"
          className="w-full rounded border p-2"
          {...register("weight")}
          defaultValue={progressData?.weight || ""}
        />
        <FormAPIError status={apiErrors?.weight} />
      </div>

      <div>
        {" "}
        <label htmlFor="energy_burnt">Estimated Energy Burnt (kcal)</label>
        <input
          id="energy_burnt"
          type="number"
          className="w-full rounded border p-2"
          {...register("energy_burnt")}
          defaultValue={progressData?.energy_burnt || ""}
        />
        <FormAPIError status={apiErrors?.energy_burnt} />
      </div>

      <div>
        <label htmlFor="notes">Notes</label>
        <input
          id="notes"
          type="text"
          className="w-full rounded border p-2"
          {...register("notes")}
          defaultValue={progressData?.notes || ""}
        />
        <FormAPIError status={apiErrors?.notes} />
      </div>

      <button
        type="submit"
        className="rounded border bg-gray-100 py-2 px-4 hover:bg-gray-200"
        disabled={createMutation.isLoading || updateMutation.isLoading}
      >
        {createMutation.isLoading || updateMutation.isLoading
          ? "Saving..."
          : "Save"}
      </button>
    </form>
  );
};

export default ProgressForm;
