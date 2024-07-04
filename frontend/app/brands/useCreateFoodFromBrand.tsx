"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";

const API = process.env.NEXT_PUBLIC_API;

const createFoodFromBrand = async ({ values, id, access }) => {
  const res = await fetch(`${API}/food/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${access}`,
    },
    body: JSON.stringify({ ...values, brand: id }),
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

const useCreateFoodFromBrand = ({ id }) => {
  const queryClient = useQueryClient();
  const access = useAccess();

  return useMutation((values) => createFoodFromBrand({ values, id, access }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["food"]);
    },
    onError: () => {},
  });
};

export default useCreateFoodFromBrand;
