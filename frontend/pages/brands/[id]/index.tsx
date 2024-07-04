import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import useGetBrand from "../../../app/brands/useGetBrand";
import { formatDateTime } from "../../../utils/format-date";

const BrandDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isLoading, error, data } = useGetBrand({ id });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div className="space-y-4 p-4">
      <Head>
        <title>{data.name} - Trackedfitness</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <h1 className="text-2xl font-bold">{data.name}</h1>

      <div>
        <Link
          href={`/${data.created_by_username}`}
          className="capitalize text-blue-600 hover:underline"
        >
          {data.created_by_username}
        </Link>
      </div>

      <div>Created {formatDateTime(data.created_at)}</div>
      <div>Updated {formatDateTime(data.updated_at)}</div>

      <div>
        <Link
          href={`/food?page=1&search=&brand=${data.id}&ordering=name`}
          className="text-blue-600 hover:underline"
        >
          View Food by {data.name}
        </Link>
      </div>

      <div>
        <Link
          href={`/brands/${id}/create-food`}
          className="text-blue-600 hover:underline"
        >
          Create Food for {data.name}
        </Link>
      </div>

      <div>
        <Link
          href={`/brands/${id}/update`}
          className="text-blue-600 hover:underline"
        >
          Edit
        </Link>
      </div>

      <div>
        <Link
          href={`/brands/${id}/delete`}
          className="text-blue-600 hover:underline"
        >
          Delete
        </Link>
      </div>
    </div>
  );
};

export default BrandDetail;
