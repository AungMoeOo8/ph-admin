import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "./components/ui/provider.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import DashboardLayout from "./layouts/DashboardLayout.tsx";
import PeoplePage from "./pages/people/PeoplePage.tsx";
import LoginPage from "./pages/auth/LoginPage.tsx";
import AddPeoplePage from "./pages/people/AddPeoplePage.tsx";
import EditPeoplePage from "./pages/people/EditPeoplePage.tsx";
import ServicePage from "./pages/service/ServicePage.tsx";
import AddServicePage from "./pages/service/AddServicePage.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="admin" element={<DashboardLayout />}>
            <Route path="people">
              <Route index element={<PeoplePage />} />
              <Route path="new" element={<AddPeoplePage />} />
              <Route path=":personId/edit" element={<EditPeoplePage />} />
            </Route>
            <Route path="service">
              <Route index element={<ServicePage />} />
              <Route path="new" element={<AddServicePage />} />
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
