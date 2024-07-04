import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const createMeal = async ({ values, access }) => {
  const res = await fetch(`${API}/items/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify({
      meal: values.meal,
      food: values.food,
      quantity_input: values.quantity_input,
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

const useCreateMealItemFromFoodDetail = () => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation((values) => createMeal({ values, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["diet"]);
      queryClient.invalidateQueries(["meals"]);
    },
  });
};

export default useCreateMealItemFromFoodDetail;
