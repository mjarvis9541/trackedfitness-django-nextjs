import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BrandListContainer from "../../app/brands/BrandList";
import useGetBrandList from "../../app/brands/useGetBrandList";
import Pagination from "../../components/Pagination";
import Search from "../../components/Search";
import Sort from "../../components/Sort";
import { brandSortOptions } from "../../utils/constants";

const BrandList = () => {
  const router = useRouter();
  const [page, setPage] = useState(Number(router.query.page) || 1);
  const [maxPage, setMaxPage] = useState(1);
  const [search, setSearch] = useState(router.query.search || "");
  const [ordering, setOrdering] = useState(router.query.ordering || "");

  const { isLoading, error, data } = useGetBrandList({
    page,
    search,
    ordering,
  });

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
        <title>Brands - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div className="flex gap-4 pt-4">
        <Search search={search} setSearch={setSearch} setPage={setPage} />
        <Sort
          ordering={ordering}
          setOrdering={setOrdering}
          setPage={setPage}
          options={brandSortOptions}
        />
      </div>

      <div className="flex flex-wrap justify-between gap-4 py-4">
        <Link
          href={`/brands/create`}
          className="flex items-center rounded border bg-gray-100 py-1.5 px-3.5 hover:bg-gray-300"
        >
          Create Brand
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

      <div className="grid grid-cols-4 md:grid-cols-[8fr_repeat(2,_minmax(0,_1fr))]">
        <BrandListContainer isLoading={isLoading} error={error} data={data} />
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

export default BrandList;
