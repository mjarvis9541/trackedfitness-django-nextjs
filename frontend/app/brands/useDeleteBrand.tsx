"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";
import { API } from "../../utils/constants";

const deleteBrand = async ({ id, access }) => {
  const res = await fetch(`${API}/brands/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
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

const useDeleteBrand = ({ id }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation(() => deleteBrand({ id, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["brands", id]);
    },
    onError: () => {},
  });
};

export default useDeleteBrand;
