"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";
import { API } from "../../utils/constants";

const getBrandListSelect = async ({ access }) => {
  const res = await fetch(`${API}/brands/select/`, {
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
  return res.json();
};

const useGetBrandListSelect = () => {
  const access = useAccess();

  return useQuery(["brands-select"], () => getBrandListSelect({ access }), {
    onSuccess: () => {},
    onError: () => {},
  });
};

export default useGetBrandListSelect;
