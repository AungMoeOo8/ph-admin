import { Outlet } from "react-router";
import AuthProvider from "./hooks/auth";
import { Provider } from "./components/ui/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const queryClient = new QueryClient();

export default function App() {

  return (
    <Provider forcedTheme="light">
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Outlet />
          <Toaster />

          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </Provider>
  );
}
