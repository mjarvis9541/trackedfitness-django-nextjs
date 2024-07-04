import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import DietFoodDetailForm from "../../../app/diet/DietFoodDetailForm";
import FoodDetailTable from "../../../app/food/FoodDetailTable";
import useGetFood from "../../../app/food/useGetFood";
import MealFoodDetailForm from "../../../app/meals/MealFoodDetailForm";
import { formatDateTime } from "../../../utils/format-date";

const FoodDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, error, data } = useGetFood({ id });

  const { register, watch } = useForm();
  const [state, setState] = useState(data && data);

  useEffect(() => {
    if (!data) return;
    const dm = data.data_measurement;
    let quantity;
    if (dm === "g" || dm === "ml") {
      quantity = Number(watch("quantity") * 0.01);
    } else {
      quantity = Number(watch("quantity"));
    }
    setState({
      quantity: Number(watch("quantity")),
      energy: Number(data.energy * quantity).toFixed(0),
      protein: Number(data.protein * quantity).toFixed(1),
      carbohydrate: Number(data.carbohydrate * quantity).toFixed(1),
      fat: Number(data.fat * quantity).toFixed(1),
      saturates: Number(data.saturates * quantity).toFixed(1),
      sugars: Number(data.sugars * quantity).toFixed(1),
      fibre: Number(data.fibre * quantity).toFixed(1),
      salt: Number(data.salt * quantity).toFixed(2),
    });
  }, [data, watch, watch("quantity")]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>
          {data.name}, {data.brand_name} - Trackedfitness
        </title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1 className="text-2xl font-bold">{data.name}</h1>

      <div>
        <Link href={`/brands/${data.brand}`} className="hover:underline">
          {data.brand_name}
        </Link>
      </div>

      <div>
        Created by{" "}
        <Link
          href={`/${data.created_by_username}`}
          className="capitalize hover:underline"
        >
          {data.created_by_username}
        </Link>
      </div>

      <div>Updated {formatDateTime(data.created_at)}</div>

      <div>Updated {formatDateTime(data.updated_at)}</div>

      <h2 className="text-xl font-bold">Nutrition Information</h2>

      <input
        type="number"
        autoComplete="off"
        className="w-full border p-2"
        step={data.data_measurement === "srv" ? 0.1 : 1}
        {...register("quantity")}
        defaultValue={data.data_value}
      />

      <FoodDetailTable data={data} state={state} />

      <h2 className="text-xl font-bold">Add to Diet</h2>
      <DietFoodDetailForm food={data} />

      <h2 className="text-xl font-bold">Add to Meal</h2>
      <MealFoodDetailForm food={data} />

      <div>
        <Link href={`/food/${data.id}/update`} className="hover:underline">
          Edit
        </Link>
      </div>

      <div>
        <Link href={`/food/${data.id}/delete`} className=" hover:underline">
          Delete
        </Link>
      </div>
    </div>
  );
};

export default FoodDetail;
