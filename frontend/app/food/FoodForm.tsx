"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormAPIError from "../../components/FormAPIError";
import FormButton from "../../components/FormButton";
import FormInput from "../../components/FormInput";
import Select from "../../components/Select";
import { servingOptions } from "../../utils/constants";
import BrandSelectForm from "../brands/BrandSelectForm";
import useGetBrandListSelect from "../brands/useGetBrandListSelect";
import useCreateFood from "./useCreateFood";
import useUpdateFood from "./useUpdateFood";

const FoodForm = ({ data }) => {
  const router = useRouter();
  const { id } = router.query;
  const [apiErrors, setApiErrors] = useState([]);
  const [foodState, setFoodState] = useState({
    energy: 0,
  });
  const {
    isLoading: brandIsLoading,
    error: brandError,
    data: brandData,
  } = useGetBrandListSelect();
  const { register, handleSubmit, watch } = useForm({ defaultValues: data });
  const createFoodMutation = useCreateFood();
  const updateFoodMutation = useUpdateFood({ id });

  useEffect(() => {
    const subscription = watch((data) => {
      const protein = (data.protein * 4).toFixed();
      const carbohydrate = (data.carbohydrate * 4).toFixed();
      const fat = (data.fat * 9).toFixed();
      const energy = Number(protein) + Number(carbohydrate) + Number(fat);
      setFoodState({
        energy: energy,
      });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data) => {
    if (!id) {
      createFoodMutation.mutate(data, {
        onSuccess: (data) => {
          setApiErrors([]);
          router.push(`/food/${data.id}`);
        },
        onError: (error) => {
          setApiErrors(error.response.data);
        },
      });
    }

    if (id) {
      updateFoodMutation.mutate(data, {
        onSuccess: (data) => {
          router.push(`/food/${data.id}`);
        },
        onError: (error) => {
          setApiErrors(error.response.data);
        },
      });
    }
  };
  ``;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormAPIError status={apiErrors?.non_field_errors} />
      <FormInput
        id="name"
        type="text"
        register={register("name")}
        apiErrors={apiErrors}
      />
      <div>
        <label htmlFor="brand">Brand</label>
        <BrandSelectForm
          id="brand"
          register={register}
          brandIsLoading={brandIsLoading}
          brandError={brandError}
          brandData={brandData}
        />
        <FormAPIError status={apiErrors?.brand} />
      </div>
      <div>
        <label htmlFor="serving">Serving</label>
        <Select
          id="serving"
          register={register("serving")}
          options={servingOptions}
        />
        <FormAPIError status={apiErrors?.serving} />
      </div>
      <FormInput
        id="energy"
        label="Calories (kcal)"
        type="number"
        register={register("energy")}
        apiErrors={apiErrors}
      />
      <div className="my-2 text-gray-400">
        Estimated calories: {foodState.energy} kcal
      </div>
      <FormInput
        id="fat"
        label="Fat (g)"
        type="number"
        step={0.1}
        register={register("fat")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="saturates"
        label="Saturates (g)"
        type="number"
        step={0.1}
        register={register("saturates")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="carbohydrate"
        label="Carbohydrate (g)"
        type="number"
        step={0.1}
        register={register("carbohydrate")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="sugars"
        label="Sugars (g)"
        type="number"
        step={0.1}
        register={register("sugars")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="fibre"
        label="Fibre (g)"
        type="number"
        step={0.1}
        register={register("fibre")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="protein"
        label="Protein (g)"
        type="number"
        step={0.1}
        register={register("protein")}
        apiErrors={apiErrors}
      />
      <FormInput
        id="salt"
        label="Salt (g)"
        type="number"
        step={0.01}
        register={register("salt")}
        apiErrors={apiErrors}
      />
      <FormButton />
    </form>
  );
};

export default FoodForm;
