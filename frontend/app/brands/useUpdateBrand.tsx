"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";
import { API } from "../../utils/constants";

const updateBrand = async ({ values, id, access }) => {
  const res = await fetch(`${API}/brands/${id}/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
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
};

const useUpdateBrand = ({ id }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation((values) => updateBrand({ values, id, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["brands"]);
    },
  });
};

export default useUpdateBrand;
