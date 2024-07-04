import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";
import { API } from "../../utils/constants";

const updateTarget = async ({ username, values, access }) => {
  const res = await fetch(`${API}/targets/${username}/`, {
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

const useUpdateTarget = ({ username }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation((values) => updateTarget({ username, values, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["target", username]);
    },
  });
};

export default useUpdateTarget;
