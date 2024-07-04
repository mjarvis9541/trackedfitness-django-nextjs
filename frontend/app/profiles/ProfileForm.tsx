"user client";

import { differenceInYears } from "date-fns";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SelectActivityLevel from "../../apps/profiles/components/SelectActivityLevel";
import SelectSex from "../../apps/profiles/components/SelectSex";
import useUpdateProfile from "../../apps/profiles/hooks/useUpdateProfile";
import FormAPIError from "../../components/FormAPIError";
import { UserContext } from "../../contexts/UserContext";

export default function ProfileForm({ data }) {
  const {
    user: { username },
  } = useContext(UserContext);
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm({ defaultValues: data });
  const [profileState, setProfileState] = useState({
    age: data.age,
    bmi: data.bmi,
    bmr: data.bmr,
    tdee: data.tdee,
  });
  const [apiErrors, setApiErrors] = useState([]);
  const updateProfile = useUpdateProfile({ username: username });

  const onSubmit = (data) => {
    updateProfile.mutate(data, {
      onSuccess: (data) => {
        router.push(`/${data.username}`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  useEffect(() => {
    const subscription = watch((data) => {
      const age = differenceInYears(new Date(), new Date(data.date_of_birth));
      // change the below to useReducer or switch statement.
      let sexCalc;
      if (data.sex === "M") {
        sexCalc = 5;
      } else {
        sexCalc = -161;
      }
      let activityLevelCalc = 1.2;
      if (data.activity_level === "SD") {
        activityLevelCalc = 1.2;
      }
      if (data.activity_level === "LA") {
        activityLevelCalc = 1.375;
      }
      if (data.activity_level === "MA") {
        activityLevelCalc = 1.55;
      }
      if (data.activity_level === "VA") {
        activityLevelCalc = 1.725;
      }
      if (data.activity_level === "EA") {
        activityLevelCalc = 1.9;
      }
      const weightCalc = Number(10 * data.weight);
      const heightCalc = Number(6.25 * data.height);
      const ageCalc = Number(5 * age);
      const bmi = Number(data.weight / (data.height / 100) ** 2).toFixed();
      const bmr = Number(weightCalc + heightCalc - ageCalc + sexCalc);
      const tdee = Number(bmr * activityLevelCalc);
      setProfileState({
        age: age,
        bmi: bmi,
        bmr: bmr,
        tdee: tdee,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <>
      <table className="w-full border-collapse border">
        <tbody>
          <tr>
            <th className="w-1/2 border p-2 text-left">Age</th>
            <td className="border p-2 text-right">{profileState?.age}</td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Body Mass Index (BMI)</th>
            <td className="border p-2 text-right">{profileState?.bmi}</td>
          </tr>
          <tr>
            <th className="border p-2 text-left">Basal Metabolic Rate (BMR)</th>
            <td className="border p-2 text-right">
              {profileState?.bmr?.toFixed()} kcal
            </td>
          </tr>
          <tr>
            <th className="border p-2 text-left">
              Total Daily Energy Expenditure (TDEE)
            </th>
            <td className="border p-2 text-right">
              {profileState?.tdee?.toFixed()} kcal
            </td>
          </tr>
        </tbody>
      </table>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <FormAPIError status={apiErrors?.non_field_errors} />

        <div>
          <label htmlFor="sex">Sex</label>
          <SelectSex id="sex" register={register} />
          <FormAPIError status={apiErrors?.sex} />
        </div>

        <div>
          <label htmlFor="weight">Weight (kg)</label>
          <input
            id="weight"
            type="number"
            autoComplete="off"
            step="0.01"
            className="w-full rounded border p-2"
            {...register("weight")}
          />
          <FormAPIError status={apiErrors?.weight} />
        </div>

        <div>
          <label htmlFor="height">Height (cm)</label>
          <input
            id="height"
            type="number"
            autoComplete="off"
            step="0.01"
            className="w-full rounded border p-2"
            {...register("height")}
          />
          <FormAPIError status={apiErrors?.height} />
        </div>

        <div>
          <label htmlFor="date_of_birth">Date of Birth</label>
          <input
            id="date_of_birth"
            autoComplete="off"
            type="date"
            className="w-full rounded border p-2"
            {...register("date_of_birth")}
          />
          <FormAPIError status={apiErrors?.date_of_birth} />
        </div>

        <div>
          <label htmlFor="activity_level">Activity Level</label>
          <SelectActivityLevel id="activity_level" register={register} />
          <FormAPIError status={apiErrors?.activity_level} />
        </div>

        <button
          type="submit"
          className="rounded bg-gray-100 py-2 px-4 hover:bg-gray-200"
          disabled={updateProfile.isLoading}
        >
          {updateProfile.isLoading ? "Loading..." : "Save"}
        </button>
      </form>
    </>
  );
}
