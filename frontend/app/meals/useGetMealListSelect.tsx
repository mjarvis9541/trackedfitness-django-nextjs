import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const getMeals = async ({ access }) => {
  const res = await fetch(`${API}/meals/my-meal-list-select/`, {
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

const useGEtMealListSelect = () => {
  const access = useAccess();

  return useQuery(["meal-select", access], () => getMeals({ access }));
};

export default useGEtMealListSelect;
