"use client";

import { useQuery } from "@tanstack/react-query";
import { useUserContext } from "../../contexts/UserContext";
import { API } from "../../utils/constants";

export default function useGetDietTargets() {
  const { user } = useUserContext();

  return useQuery({
    enabled: !!user.access && !!user?.username,
    queryKey: ["diet-targets", user.username],
    queryFn: async () => {
      const res = await fetch(`${API}/targets/${user.username}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${user.access}`,
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
    },
  });
}
