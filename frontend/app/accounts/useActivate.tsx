"use client";

import { useMutation } from "@tanstack/react-query";
import { API } from "../../utils/constants";

const activate = async ({ uid, token }) => {
  const res = await fetch(`${API}/users/activate/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid, token }),
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

const useActivate = ({ uid, token }) => {
  return useMutation({
    mutationFn: () => activate({ uid, token }),
  });
};

export default useActivate;
