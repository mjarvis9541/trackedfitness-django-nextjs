import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const deleteMeal = async ({ id, access }) => {
  const res = await fetch(`${API}/meals/${id}/`, {
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

const useDeleteMeal = ({ id }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(() => deleteMeal({ id, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["meals"]);
    },
  });
};

export default useDeleteMeal;
