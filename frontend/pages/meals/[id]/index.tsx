import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import DietMealDetailForm from "../../../app/diet/DietMealDetailForm";
import MealItemListContainer from "../../../app/meals/MealItemList";
import useGetMeal from "../../../app/meals/useGetMeal";
import { formatDateTime } from "../../../utils/format-date";

const MealDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, error, data } = useGetMeal({ id });
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [apiErrors, setApiErrors] = useState([]);

  const handleCheckAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data?.items.map((data) => JSON.stringify(data.id)));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  const handleCheck = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  const handleDeleteSelected = (data) => {
    deleteMealIdListMutation.mutate(data, {
      onSuccess: () => {
        setIsCheck([]);
        setIsCheckAll(false);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  if (isLoading) return <div> Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>Meal - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Saved meal" />
      </Head>

      <h1 className="text-2xl font-bold">Meal: {data.name}</h1>
      <Link
        href={`/${data.username}`}
        className="block text-xl font-bold hover:underline"
      >
        {data.username}
      </Link>

      <Link href={`/meals/${id}/update`} className="flex hover:underline">
        Rename Meal
      </Link>
      <Link href={`/meals/${id}/delete`} className="flex hover:underline">
        Delete Meal
      </Link>
      <div>Created: {formatDateTime(data.created_at)}</div>
      <div>Updated: {formatDateTime(data.updated_at)}</div>

      <div>Food: {data.food_count}</div>

      <Link href={`/meals/${id}/add-food`} className="block hover:underline">
        Add Food
      </Link>

      <div className="grid grid-cols-4 md:grid-cols-[auto_3fr_repeat(9,_minmax(0,_1fr))]">
        <MealItemListContainer
          isCheck={isCheck}
          isCheckAll={isCheckAll}
          handleCheck={handleCheck}
          handleCheckAll={handleCheckAll}
          isLoading={isLoading}
          error={error}
          data={data}
        />
      </div>

      <button
        onClick={handleDeleteSelected}
        disabled={isCheck.length === 0}
        className="mt-4 rounded bg-red-500 py-2 px-4 text-white hover:bg-red-600 disabled:bg-red-100"
      >
        Delete
      </button>

      <h2 className="text-xl font-bold">Add Meal to Diet</h2>
      <DietMealDetailForm mealId={id} />
    </div>
  );
};

export default MealDetail;
