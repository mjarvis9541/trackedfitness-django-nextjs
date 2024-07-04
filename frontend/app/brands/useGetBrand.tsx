"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccess } from "../../contexts/UserContext";
import getRequest from "../../utils/getRequest";

const useGetBrand = ({ id }) => {
  const access = useAccess();
  const url = `brands/${id}/`;

  return useQuery(["brands", id], () => getRequest({ url, access }), {
    enabled: !!id,
    onSuccess: () => {},
    onError: () => {},
  });
};

export default useGetBrand;
