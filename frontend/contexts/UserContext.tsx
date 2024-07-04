"use client";

import { useMutation } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import useInterval from "../hooks/useInterval";
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

const refresh = async () => {
  const res = await fetch(`${API}/auth/refresh/`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
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
export const UserContext = createContext({});

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [apiErrors, setApiErrors] = useState([]);
  const [user, setUser] = useState({});

  const mutation = useMutation({
    mutationFn: refresh,
  });

  useEffect(() => {
    if (user?.access) return setLoading(false);

    if (typeof window !== "undefined") {
      const refreshExp = localStorage.getItem("refresh");

      if (!refreshExp) return setLoading(false);

      if (new Date() > refreshExp) {
        localStorage.removeItem("refresh");
        return setLoading(false);
      }
    }

    ((data) => {
      mutation.mutate(data, {
        onSuccess: (data) => {
          const interval = Math.floor(data.access_exp - Date.now() - 10000);
          setUser({
            initials: data.initials,
            username: data.username,
            email: data.email,
            full_name: data.full_name,
            access: data.access,
            access_exp: data.access_exp,
            refresh_exp: data.refresh_exp,
            last_login: data.last_login,
            interval: interval,
          });
          localStorage.setItem("refresh", data.refresh_exp);
        },
        onError: (error) => {
          setApiErrors(error.response.data);
          localStorage.removeItem("refresh");
        },
      });
    })();
  }, []);

  useInterval(() => {
    if (!user.interval) return;

    ((data) => {
      mutation.mutate(data, {
        onSuccess: (data) => {
          const interval = Math.floor(data.access_exp - Date.now() - 10000);
          setUser({
            initials: data.initials,
            username: data.username,
            email: data.email,
            full_name: data.full_name,
            access: data.access,
            access_exp: data.access_exp,
            refresh_exp: data.refresh_exp,
            last_login: data.last_login,
            interval: interval,
          });
          localStorage.setItem("refresh", data.refresh_exp);
        },
        onError: (error) => {
          setApiErrors(error.response.data);
          localStorage.removeItem("refresh");
        },
      });
    })();
  }, user.interval);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

export const useAccess = () => {
  const {
    user: { access },
  } = useContext(UserContext);
  return access;
};

export const useUserContext = () => useContext(UserContext);
