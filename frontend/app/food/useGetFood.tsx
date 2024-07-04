import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const getFood = async ({ id, access }) => {
  const res = await fetch(`${API}/food/${id}/`, {
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

const useGetFood = ({ id }) => {
  const access = useAccess();

  return useQuery(["food", id], () => getFood({ id, access }), {
    enabled: !!id,
  });
};

export default useGetFood;
