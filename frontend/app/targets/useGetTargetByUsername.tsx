import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const getTarget = async ({ username, access }) => {
  const res = await fetch(`${API}/targets/${username}/`, {
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

const useGetTargetByUsername = ({ username }) => {
  const access = useAccess();

  return useQuery(["target", username], () => getTarget({ username, access }));
};

export default useGetTargetByUsername;
