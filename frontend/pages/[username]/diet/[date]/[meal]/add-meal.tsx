import { formatISO } from "date-fns";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import DietAddMealListContainer from "../../../../../app/diet/DietAddMealList";
import useCreateDietFromMeal from "../../../../../app/diet/useCreateDietFromMeal";
import useGetMealsWithFood from "../../../../../app/meals/useGetMealItemsWithFood";
import Pagination from "../../../../../components/Pagination";
import Search from "../../../../../components/Search";
import Sort from "../../../../../components/Sort";
import UserNav from "../../../../../components/UserNav";
import { mealSortOptions } from "../../../../../utils/constants";

const DietAddMeal = () => {
  const router = useRouter();
  const {
    username,
    date = formatISO(new Date(), { representation: "date" }),
    meal,
  } = router.query;

  const [page, setPage] = useState(Number(router.query.page) || 1);
  const [maxPage, setMaxPage] = useState(1);
  const [search, setSearch] = useState(router.query.search || "");
  const [ordering, setOrdering] = useState(router.query.ordering || "");

  const [apiErrors, setApiErrors] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const { isLoading, error, data } = useGetMealsWithFood({
    page,
    search,
    ordering,
  });

  const createMutation = useCreateDietFromMeal({ username, date, meal });

  const handleCheckAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data?.results.map((data) => JSON.stringify(data.id)));
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

  const handleAdd = (mealId) => {
    createMutation.mutate(mealId, {
      onSuccess: () => {
        router.push(`/${username}/diet/${date}`);
      },
      onError: (error) => {
        setApiErrors(error.response.data);
      },
    });
  };

  return (
    <div className="px-3">
      <Head>
        <title>Add Meal - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <UserNav username={username} />

      <h1 className="my-3 text-xl font-bold">Add Meal</h1>

      <div className="flex gap-4">
        <Search search={search} setSearch={setSearch} setPage={setPage} />
        <Sort
          ordering={ordering}
          setOrdering={setOrdering}
          setPage={setPage}
          options={mealSortOptions}
        />
      </div>

      <div className="flex flex-wrap justify-between gap-4 py-4">
        <Link
          href={`/meals/create`}
          className="flex items-center rounded border bg-gray-100 py-1.5 px-3.5 hover:bg-gray-300"
        >
          Create Meal
        </Link>
        <button
          className="rounded border bg-gray-100 py-1.5 px-3.5 hover:bg-gray-300"
          onClick={() => {
            setSearch("");
            setPage(1);
            setOrdering("");
          }}
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-[4fr_repeat(11,_minmax(0,_1fr))]">
        <DietAddMealListContainer
          isCheck={isCheck}
          handleCheck={handleCheck}
          isCheckAll={isCheckAll}
          handleCheckAll={handleCheckAll}
          isLoading={isLoading}
          error={error}
          data={data}
          handleAdd={handleAdd}
          createMutation={createMutation}
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

export default DietAddMeal;
