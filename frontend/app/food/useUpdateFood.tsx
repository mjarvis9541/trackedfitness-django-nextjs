import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const updateFood = async ({ values, id, access }) => {
  const res = await fetch(`${API}/food/${id}/`, {
    method: "PUT",
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

const useUpdateFood = ({ id }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation((values) => updateFood({ values, id, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["food", id]);
    },
  });
};

export default useUpdateFood;
