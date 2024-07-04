"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";
import { API } from "../../utils/constants";

const deleteBrandIdList = async ({ idList, access }) => {
  const res = await fetch(`${API}/brands/delete-selected/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify({ brand_id_list: idList }),
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

const useDeleteBrandIdList = ({ idList }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(() => deleteBrandIdList({ idList, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["brands"]);
    },
    onError: () => {},
  });
};

export default useDeleteBrandIdList;
