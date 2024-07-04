"use client";

import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../../contexts/UserContext";
import { API } from "../../utils/constants";

const useGetBrandList = ({ page, search, ordering }) => {
  const { user } = useUserContext();

  return useQuery({
    enabled: !!user?.access,
    queryKey: ["brand-list", { page, search, ordering }],
    queryFn: async () => {
      const res = await fetch(
        `${API}/brands/?page=${page}&search=${search}&ordering=${ordering}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${user.access}`,
          },
        }
      );
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
    },
    onSuccess: () => {},
    onError: () => {},
  });
};

export default useGetBrandList;
