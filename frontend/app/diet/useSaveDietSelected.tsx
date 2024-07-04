import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const saveDietSelected = async ({ mealName, isCheck, access }) => {
  const res = await fetch(`${API}/diet/save-selected/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify({ meal_name: mealName, id_list: isCheck }),
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

const useSaveDietSelected = ({ mealName, isCheck }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(() => saveDietSelected({ mealName, isCheck, access }), {});
};

export default useSaveDietSelected;
