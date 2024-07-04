"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserContextProvider from "./UserContext";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>{children}</UserContextProvider>
    </QueryClientProvider>
  );
}
