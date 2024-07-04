import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MealListContainer from "../../app/meals/MealListContainer";
import useGetMealList from "../../app/meals/useGetMealList";
import FormAPIError from "../../components/FormAPIError";
import Pagination from "../../components/Pagination";
import Search from "../../components/Search";
import Sort from "../../components/Sort";
import { mealSortOptions } from "../../utils/constants";

const MealList = () => {
  const router = useRouter();
  const [page, setPage] = useState(Number(router.query.page) || 1);
  const [maxPage, setMaxPage] = useState(1);
  const [search, setSearch] = useState(router.query.search || "");
  const [ordering, setOrdering] = useState(router.query.ordering || "");
  const [apiErrors, setApiErrors] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const { isLoading, error, data } = useGetMealList({
    page,
    search,
    ordering,
  });
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

  useEffect(() => {
    if (!data) return;
    const totalPages = Math.ceil(data.count / 25);
    if (totalPages === 0) {
      setMaxPage(1);
    } else {
      setMaxPage(totalPages);
    }
  }, [data]);
  useEffect(() => {
    router.replace(
      {
        pathname: "",
        query: {
          page: page,
          search: search,
          ordering: ordering,
        },
      },
      undefined,
      { shallow: true }
    );
  }, [search, page, ordering]);

  return (
    <div className="px-3">
      <Head>
        <title>Meals - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="flex gap-4 pt-4">
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

      <FormAPIError status={apiErrors?.non_field_errors} />

      <div className="grid grid-cols-4 md:grid-cols-[4fr_repeat(10,_minmax(0,_1fr))]">
        <MealListContainer
          isCheck={isCheck}
          isCheckAll={isCheckAll}
          handleCheck={handleCheck}
          handleCheckAll={handleCheckAll}
          isLoading={isLoading}
          error={error}
          data={data}
        />
      </div>

      <div className="py-4">
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

export default MealList;
