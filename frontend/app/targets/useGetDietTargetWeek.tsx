import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const getDietTargetWeek = async ({ username, date, access }) => {
  const res = await fetch(`${API}/diet-targets-week/${username}/${date}/`, {
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

const useGetDietTargetWeek = ({ username, date }) => {
  const access = useAccess();

  return useQuery(["diet-target-week", username, date], () =>
    getDietTargetWeek({ username, date, access })
  );
};

export default useGetDietTargetWeek;
