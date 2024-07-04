import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const updateMealItem = async ({ values, itemId, access }) => {
  const res = await fetch(`${API}/items/${itemId}/`, {
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

const useUpdateMealItem = ({ itemId }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation((values) => updateMealItem({ values, itemId, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["item"]);
      queryClient.invalidateQueries(["meal"]);
    },
  });
};

export default useUpdateMealItem;
