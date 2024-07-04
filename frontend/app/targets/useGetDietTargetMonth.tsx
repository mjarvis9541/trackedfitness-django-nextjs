import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const getDietTarget = async ({ username, date, access }) => {
  const res = await fetch(`${API}/diet-targets-month/${username}/${date}/`, {
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

const useGetDietTargetMonth = ({ username, date }) => {
  const access = useAccess();

  return useQuery(["diet-target-month", username, date], () =>
    getDietTarget({ username, date, access })
  );
};

export default useGetDietTargetMonth;
