import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const deleteMealSelected = async ({ isCheck, access }) => {
  const res = await fetch(`${API}/meals/delete-selected/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify({ id_list: isCheck }),
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

const useDeleteMealSelected = ({ isCheck }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(() => deleteMealSelected({ isCheck, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["meals"]);
    },
  });
};

export default useDeleteMealSelected;
