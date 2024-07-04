import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const createDietFromMeal = async ({ username, date, meal, values, access }) => {
  const res = await fetch(`${API}/diet/create-from-meal/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify({
      username: username,
      date: date,
      meal: meal,
      saved_meal: values,
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

const useCreateDietFromMeal = ({ username, date, meal }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(
    (values) => createDietFromMeal({ username, date, meal, values, access }),
    {
      onSuccess: () => queryClient.invalidateQueries(["diet"]),
    }
  );
};

export default useCreateDietFromMeal;
