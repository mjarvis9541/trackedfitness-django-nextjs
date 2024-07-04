import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const getMealItem = async ({ itemId, access }) => {
  const res = await fetch(`${API}/items/${itemId}/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
  });
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

const useGetMealItem = ({ itemId }) => {
  const access = useAccess();

  return useQuery(["item", itemId], () => getMealItem({ itemId, access }));
};

export default useGetMealItem;
