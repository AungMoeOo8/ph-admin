import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouteObject, RouterProvider } from "react-router";
import DashboardLayout, { dashboardLoader } from "./layouts/DashboardLayout.tsx";
import PeoplePage from "./pages/people/PeoplePage.tsx";
import AddPeoplePage from "./pages/people/AddPeoplePage.tsx";
import EditPeoplePage from "./pages/people/EditPeoplePage.tsx";
import ServicePage from "./pages/service/ServicePage.tsx";
import AddServicePage from "./pages/service/AddServicePage.tsx";

import EditServicePage from "./pages/service/EditServicePage.tsx";
import CoursePage from "./pages/course/CoursePage.tsx";
import AddCoursePage from "./pages/course/AddCoursePage.tsx";
import EditCoursePage from "./pages/course/EditCoursePage.tsx";
import AddActivityPage from "./pages/activity/AddActivityPage.tsx";
import App from "./App.tsx";
import ActivityPage from "./pages/activity/ActivityPage.tsx";
import React from "react";
import "./index.css";
import { loginLoader } from "./pages/auth/LoginPage";

const LoginPage = React.lazy(() => import("./pages/auth/LoginPage"));

const PeopleRoutes: RouteObject = {
  path: "people",
  children: [
    {
      index: true,
      Component: PeoplePage
    },
    {
      path: "new",
      Component: AddPeoplePage
    },
    {
      path: ":personId/edit",
      Component: EditPeoplePage
    }
  ]
}

const ServiceRoutes: RouteObject = {
  path: "services",
  children: [
    {
      index: true,
      Component: ServicePage,
    },
    {
      path: "new",
      Component: AddServicePage
    },
    {
      path: ":serviceId/edit",
      Component: EditServicePage
    }
  ]
}

const CourseRoutes: RouteObject = {
  path: "courses",
  children: [
    {
      index: true,
      Component: CoursePage
    },
    {
      path: "new",
      Component: AddCoursePage
    },
    {
      path: ":courseId/edit",
      Component: EditCoursePage
    }
  ]
}

const ActivityRoutes: RouteObject = {
  path: "activities",
  children: [
    {
      index: true,
      Component: ActivityPage
    },
    {
      path: "new",
      Component: AddActivityPage
    },
  ]
}

const router = createBrowserRouter([
  {
    path: "/", Component: App,
    children: [
      {
        path: "/login", Component: LoginPage,
        loader: loginLoader
      },
      {
        path: "dashboard",
        Component: DashboardLayout,
        loader: dashboardLoader,
        children: [
          PeopleRoutes,
          ServiceRoutes,
          CourseRoutes,
          ActivityRoutes
        ]
      }]
  }
])

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <RouterProvider router={router} />

  // </StrictMode>
);