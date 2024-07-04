import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const copyPreviousWeek = async ({ username, date, access }) => {
  const res = await fetch(`${API}/diet-targets/copy-previous-week/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify({
      username: username,
      date: date,
    }),
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

const useCopyDietTargetPreviousWeek = ({ username, date }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation((values) => copyPreviousWeek({ username, date, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["diet-target-week", username, date]);
    },
  });
};

export default useCopyDietTargetPreviousWeek;
