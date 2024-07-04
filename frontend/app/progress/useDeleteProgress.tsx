import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const deleteProgress = async ({ id, access }) => {
  const res = await fetch(`${API}/progress/${id}/`, {
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

const useDeleteProgress = ({ id, date }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(() => deleteProgress({ id, access }), {
    onSuccess: () => queryClient.invalidateQueries(["progress-date", date]),
  });
};

export default useDeleteProgress;
