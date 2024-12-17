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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="admin/people" element={<DashboardLayout />}>
            <Route index element={<PeoplePage />} />
            <Route path="new" element={<AddPeoplePage />} />
            <Route path=":personId/edit" element={<EditPeoplePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
