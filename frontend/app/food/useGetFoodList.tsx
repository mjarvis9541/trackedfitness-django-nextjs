import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const fetchFood = async ({ page, brand, search, ordering, access }) => {
  const res = await fetch(
    `${API}/food/?page=${page}&brand=${brand}&search=${search}&ordering=${ordering}`,
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

const useGetFoodList = ({ page, brand, search, ordering }) => {
  const access = useAccess();

  return useQuery(["food", page, brand, search, ordering], () =>
    fetchFood({
      page,
      brand,
      search,
      ordering,
      access,
    })
  );
};

export default useGetFoodList;
