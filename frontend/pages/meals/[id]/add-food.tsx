import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import BrandSelect from "../../../app/brands/BrandSelect";
import useGetBrandListSelect from "../../../app/brands/useGetBrandListSelect";
import DietAddFoodListContainer from "../../../app/diet/DietAddFoodList";
import useGetFoodList from "../../../app/food/useGetFoodList";
import useCreateMealItem from "../../../app/meals/useCreateMealItem";
import useGetMeal from "../../../app/meals/useGetMeal";
import FormAPIError from "../../../components/FormAPIError";
import Pagination from "../../../components/Pagination";
import Search from "../../../components/Search";
import Sort from "../../../components/Sort";
import { foodSortOptions } from "../../../utils/constants";

const AddFoodToMeal = () => {
  const router = useRouter();
  const { id } = router.query;
  const [page, setPage] = useState(Number(router.query.page) || 1);
  const [maxPage, setMaxPage] = useState(1);
  const [search, setSearch] = useState(router.query.search || "");
  const [ordering, setOrdering] = useState(
    router.query.ordering || "-added_to_diary_last_date"
  );
  const [brand, setBrand] = useState("");
  const { isLoading, error, data } = useGetFoodList({
    page,
    brand,
    search,
    ordering,
  });
  const {
    isLoading: mealIsLoading,
    error: mealError,
    data: mealData,
  } = useGetMeal({ id });
  const {
    isLoading: brandIsLoading,
    error: brandError,
    data: brandData,
  } = useGetBrandListSelect();
  const [apiErrors, setApiErrors] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const createItemMutation = useCreateMealItem({ id });
  const onSubmit = (data) => {
    createItemMutation.mutate(data, {
      onSuccess: (data) => {
        router.push(`/meals/${id}`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };
  if (mealIsLoading) return <div className="p-4">Loading...</div>;
  if (mealError) return <div className="p-4">Error</div>;

  return (
    <div className="p-4">
      <Head>
        <title>Add Food to Meal - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1 className="pb-4 text-xl font-bold">
        <Link href={`/meals/${mealData.id}`}>
          Add Food to Meal - {mealData.name}
        </Link>
      </h1>

      <div className="flex gap-4">
        <Search search={search} setSearch={setSearch} setPage={setPage} />
        <BrandSelect
          brandIsLoading={brandIsLoading}
          brandError={brandError}
          brandData={brandData}
          brand={brand}
          setBrand={setBrand}
        />
        <Sort
          ordering={ordering}
          setOrdering={setOrdering}
          setPage={setPage}
          options={foodSortOptions}
        />
      </div>

      <FormAPIError status={apiErrors?.non_field_errors} />

      <div className="flex flex-wrap justify-between gap-4 py-4">
        <Link
          href={`/food/create`}
          className="flex items-center rounded border bg-gray-100 py-1.5 px-3.5 hover:bg-gray-300"
        >
          Create Food
        </Link>
        <button
          className="rounded border bg-gray-100 py-1.5 px-3.5 hover:bg-gray-300"
          onClick={() => {
            setSearch("");
            setPage(1);
            setBrand("");
            setOrdering("");
          }}
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-[2fr_repeat(12,_minmax(0,_1fr))]">
        <DietAddFoodListContainer
          onSubmit={onSubmit}
          isLoading={isLoading}
          error={error}
          data={data}
          isCheckAll={isCheckAll}
          setIsCheckAll={setIsCheckAll}
          createDiet={createItemMutation}
        />
      </div>

      <div className="my-4">
        <Pagination
          isLoading={isLoading}
          error={error}
          data={data}
          page={page}
          setPage={setPage}
          maxPage={maxPage}
        />
      </div>
    </div>
  );
};

export default AddFoodToMeal;
