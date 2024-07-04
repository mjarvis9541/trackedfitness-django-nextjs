import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const dietCopyPreviousDay = async ({ username, prev, date, access }) => {
  const res = await fetch(`${API}/diet/create-from-date/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify({
      username: username,
      from_date: prev,
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

const useDietCreateFromDate = ({ username, prev, date }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(
    () => dietCopyPreviousDay({ username, prev, date, access }),
    {
      onSuccess: () =>
        queryClient.invalidateQueries(["diet-day", username, date]),
    }
  );
};

export default useDietCreateFromDate;
