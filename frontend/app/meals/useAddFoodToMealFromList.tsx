import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const createItem = async ({ values, meal, access }) => {
  const res = await fetch(`${API}/items/create-from-list/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify({
      meal: meal,
      data_list: values,
    }),
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

const useAddFoodToMealFromList = ({ meal }) => {
  const queryClient = useQueryClient();
  const access = useAccess();
  return useMutation((values) => createItem({ values, meal, access }));
};

export default useAddFoodToMealFromList;
