import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const dietCreateFromDateMeal = async ({
  username,
  fromDate,
  toDate,
  fromMeal,
  toMeal,
  access,
}) => {
  const res = await fetch(`${API}/diet/create-from-date-meal/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify({
      username: username,
      from_date: fromDate,
      date: toDate,
      from_meal: fromMeal,
      meal: toMeal,
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

const useDietCreateFromDateMeal = ({
  username,
  date,
  fromDate,
  toDate,
  fromMeal,
  toMeal,
}) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(
    () =>
      dietCreateFromDateMeal({
        username,
        fromDate,
        toDate,
        fromMeal,
        toMeal,
        access,
      }),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(["diet-day", username, date]),
    }
  );
};

export default useDietCreateFromDateMeal;
