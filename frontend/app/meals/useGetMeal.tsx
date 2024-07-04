import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const getMeal = async ({ id, access }) => {
  const res = await fetch(`${API}/meals/${id}/`, {
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

const useGetMeal = ({ id }) => {
  const access = useAccess();

  return useQuery(["meal", id], () => getMeal({ id, access }));
};

export default useGetMeal;
