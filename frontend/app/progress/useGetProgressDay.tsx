import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const getProgress = async ({ username, date, access }) => {
  const res = await fetch(`${API}/progress-day/${username}/${date}/`, {
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

const useGetProgressDay = ({ username, date }) => {
  const access = useAccess();

  return useQuery(
    ["progress-date", username, date],
    () => getProgress({ username, date, access }),
    {
      retry: 0,
    }
  );
};

export default useGetProgressDay;
