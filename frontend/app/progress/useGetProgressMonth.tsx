import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const getProgressListMonth = async ({ username, date, access }) => {
  const res = await fetch(`${API}/progress-month/${username}/${date}/`, {
    headers: { Authorization: `JWT ${access}` },
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

const useGetProgressMonth = ({ username, date }) => {
  const access = useAccess();

  return useQuery(["progress-month", username, date], () =>
    getProgressListMonth({ username, date, access })
  );
};

export default useGetProgressMonth;
