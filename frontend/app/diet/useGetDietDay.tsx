import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const getDietDay = async ({ username, date, access }) => {
  const res = await fetch(`${API}/diet-day/${username}/${date}/`, {
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

const useGetDietDay = ({ username, date }) => {
  const access = useAccess();

  return useQuery(["diet-day", username, date], () =>
    getDietDay({ username, date, access })
  );
};

export default useGetDietDay;
