import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const fetchMeals = async ({ page, search, ordering, access }) => {
  const res = await fetch(
    `${API}/meals/?page=${page}&search=${search}&ordering=${ordering}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${access}`,
      },
    }
  );
  if (!res.ok) {
    throw {
      message: `Request failed with status code ${res.status}`,
      response: {
        data: res.status < 404 && (await res.json()),
        status: res.status,
        statusText: res.statusText,
      },
    };
  }
  return res.json();
};

const useGetMealList = ({ page, search, ordering }) => {
  const access = useAccess();

  return useQuery(["meals", page, search, ordering], () =>
    fetchMeals({
      page,
      search,
      ordering,
      access,
    })
  );
};

export default useGetMealList;
