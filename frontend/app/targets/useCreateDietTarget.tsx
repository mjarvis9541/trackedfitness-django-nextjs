import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const createTarget = async ({ access, values }) => {
  const res = await fetch(`${API}/diet-targets/`, {
    method: "POST",
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

const useCreateDietTarget = () => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation((values) => createTarget({ access, values }), {
    onSuccess: () => {
      //   queryClient.invalidateQueries(["diet-target", username, date]);
    },
  });
};

export default useCreateDietTarget;
