import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const createProgress = async ({ values, username, date, access }) => {
  const res = await fetch(`${API}/progress/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify({
      username: username,
      date: date,
      notes: values.notes,
      ...values,
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

const useCreateProgress = ({ username, date }) => {
  const queryClient = useQueryClient();
  const access = useAccess();
  return useMutation(
    (values) => createProgress({ values, username, date, access }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["progress"]);
      },
    }
  );
};

export default useCreateProgress;
