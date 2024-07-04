import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const deleteDietTarget = async ({ username, dateList, access }) => {
  const res = await fetch(`${API}/diet-targets/delete-from-date-list/`, {
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

const useDeleteDietTargetDateList = ({ username, date, dateList }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(() => deleteDietTarget({ username, dateList, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["diet-target-week", username, date]);
      queryClient.invalidateQueries(["diet-target-month", username, date]);
    },
  });
};

export default useDeleteDietTargetDateList;
