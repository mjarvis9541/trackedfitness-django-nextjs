import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const updateCreateDietTarget = async ({
  username,
  dateList,
  values,
  access,
}) => {
  const res = await fetch(`${API}/diet-targets/update-create-from-date-list/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify({
      date_list: dateList,
      username: username,
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

const useUpdateCreateDietTargetDateList = ({ username, date, dateList }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(
    (values) => updateCreateDietTarget({ username, dateList, values, access }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["diet-target-week", username, date]);
      },
    }
  );
};

export default useUpdateCreateDietTargetDateList;
