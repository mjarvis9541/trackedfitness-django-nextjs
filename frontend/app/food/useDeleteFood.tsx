import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const deleteFood = async ({ id, access }) => {
  const res = await fetch(`${API}/food/${id}/`, {
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

const useDeleteFood = ({ id }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(() => deleteFood({ id, access }), {
    onSuccess: () => {
      // queryClient.invalidateQueries(["food"]);
    },
  });
};

export default useDeleteFood;
