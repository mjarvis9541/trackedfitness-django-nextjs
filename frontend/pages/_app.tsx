import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "../app/globals.css";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import UserContextProvider from "../contexts/UserContext";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <Layout>
          <ProtectedRoute>
            <Component {...pageProps} />
          </ProtectedRoute>
          <ReactQueryDevtools />
        </Layout>
      </UserContextProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
