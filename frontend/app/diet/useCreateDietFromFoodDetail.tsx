import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const createDiet = async ({ username, values, access }) => {
  const res = await fetch(`${API}/diet/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify({
      username: username,
      meal: values.meal,
      date: values.date,
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

const useCreateDietFromFoodDetail = ({ username }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation((values) => createDiet({ username, values, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["diet"]);
      queryClient.invalidateQueries(["food"]);
    },
  });
};

export default useCreateDietFromFoodDetail;
