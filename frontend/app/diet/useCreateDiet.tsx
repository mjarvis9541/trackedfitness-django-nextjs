import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserContext } from "../../contexts/UserContext";
import { API } from "../../utils/constants";

const useCreateDiet = () => {
  const queryClient = useQueryClient();
  const { user } = useUserContext();

  return useMutation({
    mutationFn: async (values) => {
      const res = await fetch(`${API}/diet/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${user.access}`,
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
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["diet-day"]);
    },
  });
};

export default useCreateDiet;
