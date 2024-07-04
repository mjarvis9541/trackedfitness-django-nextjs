import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const deleteDietSelected = async ({ username, isCheck, access }) => {
  const res = await fetch(`${API}/diet/delete-from-id-list/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify({ username: username, id_list: isCheck }),
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

const useDeleteDietIdList = ({ username, date, isCheck }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(() => deleteDietSelected({ username, isCheck, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["diet-day", username, date]);
    },
  });
};

export default useDeleteDietIdList;
