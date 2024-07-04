import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const bulkDeleteProgress = async ({ username, dateList, access }) => {
  const res = await fetch(`${API}/progress/delete-from-date-list/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify({ username: username, date_list: dateList }),
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

const useBulkDeleteProgress = ({ username, dateList, date }) => {
  const queryClient = useQueryClient();
  const access = useAccess();
  return useMutation(() => bulkDeleteProgress({ username, dateList, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["progress-month", username, date]);
    },
  });
};

export default useBulkDeleteProgress;
