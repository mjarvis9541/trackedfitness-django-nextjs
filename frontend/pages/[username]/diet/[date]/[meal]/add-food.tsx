import { formatISO } from "date-fns";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BrandSelect from "../../../../../app/brands/BrandSelect";
import useGetBrandListSelect from "../../../../../app/brands/useGetBrandListSelect";
import DietAddFoodListContainer from "../../../../../app/diet/DietAddFoodList";
import useCreateDiet from "../../../../../app/diet/useCreateDiet";
import useGetFoodList from "../../../../../app/food/useGetFoodList";
import FormAPIError from "../../../../../components/FormAPIError";
import Pagination from "../../../../../components/Pagination";
import Search from "../../../../../components/Search";
import Sort from "../../../../../components/Sort";
import UserNav from "../../../../../components/UserNav";
import { foodSortOptions } from "../../../../../utils/constants";

const DietAddFood = () => {
  const router = useRouter();
  const {
    username,
    date = formatISO(new Date(), { representation: "date" }),
    meal,
  } = router.query;
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
    isLoading: brandIsLoading,
    error: brandError,
    data: brandData,
  } = useGetBrandListSelect();
  const [apiErrors, setApiErrors] = useState([]);
  const createDiet = useCreateDiet();

  const onSubmit = (data) => {
    createDiet.mutate(data, {
      onSuccess: (data) => {
        router.push(`/${username}/diet/${date}`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  useEffect(() => {
    if (!data) return;
    const totalPages = Math.ceil(data.count / 25);
    if (totalPages === 0) {
      setMaxPage(1);
    } else {
      setMaxPage(totalPages);
    }
  }, [data]);

  return (
    <div className="px-3">
      <Head>
        <title>Add Food - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <UserNav username={username} />

      <h1 className="my-3 text-xl font-bold">Add Food</h1>

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
      <FormAPIError status={apiErrors?.quantity_input} />

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
          username={username}
          date={date}
          meal={meal}
          onSubmit={onSubmit}
          data={data}
          createDiet={createDiet}
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

export default DietAddFood;
