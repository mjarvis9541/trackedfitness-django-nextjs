import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const getTarget = async ({ username, date, access }) => {
  const res = await fetch(`${API}/diet-targets-day/${username}/${date}/`, {
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

const useGetDietTargetDate = ({ username, date }) => {
  const access = useAccess();

  return useQuery(
    ["diet-target", username, date],
    () => getTarget({ username, date, access }),
    { retry: 0 }
  );
};

export default useGetDietTargetDate;
