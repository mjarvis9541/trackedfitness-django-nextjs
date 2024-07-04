import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const deleteMealItem = async ({ itemId, access }) => {
  const res = await fetch(`${API}/items/${itemId}/`, {
    method: "DELETE",
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
  return res.status;
};

const useDeleteMealItem = ({ itemId }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(() => deleteMealItem({ itemId, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["items"]);
    },
  });
};

export default useDeleteMealItem;
