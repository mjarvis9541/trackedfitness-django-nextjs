import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const createFood = async ({ values, access }) => {
  const res = await fetch(`${API}/food/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify(values),
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

const useCreateFood = () => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation((values) => createFood({ values, access }), {
    // onSuccess: () => queryClient.invalidateQueries(["food"]),
  });
};

export default useCreateFood;
