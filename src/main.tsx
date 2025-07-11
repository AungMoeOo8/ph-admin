import { createRoot } from "react-dom/client";
import { Provider } from "./components/ui/provider.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import PeoplePage from "./pages/people/PeoplePage.tsx";
import AddPeoplePage from "./pages/people/AddPeoplePage.tsx";
import EditPeoplePage from "./pages/people/EditPeoplePage.tsx";
import ServicePage from "./pages/service/ServicePage.tsx";
import AddServicePage from "./pages/service/AddServicePage.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import EditServicePage from "./pages/service/EditServicePage.tsx";
import CoursePage from "./pages/course/CoursePage.tsx";
import AddCoursePage from "./pages/course/AddCoursePage.tsx";
import EditCoursePage from "./pages/course/EditCoursePage.tsx";
import AddActivityPage from "./pages/activity/AddActivityPage.tsx";
import App from "./App.tsx";
import ActivityPage from "./pages/activity/ActivityPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import "./index.css";
import AuthProvider from "./hooks/auth.tsx";

const LoginPage = React.lazy(() => import("./pages/auth/LoginPage"));

export const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Provider forcedTheme="light">
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route path="people">
                  <Route index element={<PeoplePage />} />
                  <Route path="new" element={<AddPeoplePage />} />
                  <Route path=":personId/edit" element={<EditPeoplePage />} />
                </Route>
                <Route path="service">
                  <Route index element={<ServicePage />} />
                  <Route path="new" element={<AddServicePage />} />
                  <Route path=":serviceId/edit" element={<EditServicePage />} />
                </Route>
                <Route path="course">
                  <Route index element={<CoursePage />} />
                  <Route path="new" element={<AddCoursePage />} />
                  <Route path=":courseId/edit" element={<EditCoursePage />} />
                </Route>
                <Route path="activity">
                  <Route index element={<ActivityPage />} />
                  <Route path="new" element={<AddActivityPage />} />
                </Route>
              </Route>
            </Route>
          </Routes>
          <Toaster />

          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </Provider>
  // </StrictMode>
);
