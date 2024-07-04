import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const deleteDiet = async ({ id, access }) => {
  const res = await fetch(`${API}/diet/${id}/`, {
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

const useDeleteDiet = ({ id }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(() => deleteDiet({ id, access }), {
    // onSuccess: () => queryClient.invalidateQueries(["diet"]),
  });
};

export default useDeleteDiet;
