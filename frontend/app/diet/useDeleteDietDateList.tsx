import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const deleteDiet = async ({ username, dateList, access }) => {
  const res = await fetch(`${API}/diet/delete-from-date-list/`, {
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

const useDeleteDietDateList = ({ username, date, dateList }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(() => deleteDiet({ username, dateList, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["diet-week", username, date]);
      queryClient.invalidateQueries(["diet-day", username, date]);
    },
  });
};

export default useDeleteDietDateList;
