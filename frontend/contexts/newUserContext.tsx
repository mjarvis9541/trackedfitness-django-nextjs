"use client";

import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import FormAPIError from "../components/FormAPIError";
import { API } from "../utils/constants";

type User = {
  id: number;
  email: string;
  username: string;
  name: string;
  initials: string;
  last_login: string;
  access_exp: string;
  refresh_exp: string;
  access: string;
};

export const UserContext = createContext({});

export default function UserContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState({});
  const [apiErrors, setApiErrors] = useState({});

  const mutation = useMutation({
    mutationFn: async (values) => {
      const res = await fetch(`${API}/auth/refresh/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
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
    },
    onError: (error) => {
      setApiErrors(error.response.data);
    },
    onSuccess: (data) => {
      setUser(data);
    },
  });

  useEffect(() => {
    if (user?.access) return;
    mutation.mutate();
    return () => {};
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <FormAPIError status={apiErrors?.non_field_errors} />
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
