import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const getDietMeal = async ({ username, date, meal, access }) => {
  const res = await fetch(`${API}/diet-day/${username}/${date}/?meal=${meal}`, {
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

const useGetDietMeal = ({ username, date, meal }) => {
  const access = useAccess();

  return useQuery(
    ["diet-meal", username, date, meal],
    () => getDietMeal({ username, date, meal, access }),
    { enabled: !!username && !!date && !!meal && !!access }
  );
};

export default useGetDietMeal;
