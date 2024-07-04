import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const updateDietTarget = async ({ id, values, access }) => {
  const res = await fetch(`${API}/diet-targets/${id}/`, {
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

const useUpdateDietTarget = ({ id }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation((values) => updateDietTarget({ id, values, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["diet-target"]);
    },
  });
};

export default useUpdateDietTarget;
