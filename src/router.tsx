import React from "react";
import { createBrowserRouter, LoaderFunction, redirect, RouteObject } from "react-router";
import PeoplePage from "./pages/people/PeoplePage";
import AddPeoplePage from "./pages/people/AddPeoplePage";
import EditPeoplePage from "./pages/people/EditPeoplePage";
import ServicePage from "./pages/service/ServicePage";
import AddServicePage from "./pages/service/AddServicePage";
import EditServicePage from "./pages/service/EditServicePage";
import CoursePage from "./pages/course/CoursePage";
import AddCoursePage from "./pages/course/AddCoursePage";
import EditCoursePage from "./pages/course/EditCoursePage";
import ActivityPage from "./pages/activity/ActivityPage";
import AddActivityPage from "./pages/activity/AddActivityPage";
import { getUserFromStorage } from "./util";
import App from "./App";
import { loginLoader } from "./pages/auth/LoginPage";
import DashboardLayout, { dashboardLoader } from "./layouts/DashboardLayout";

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

const HomePageLoader: LoaderFunction = () => {
  const user = getUserFromStorage();
  if (!user) {

    throw redirect(
      `/login`,
    );
  }

  throw redirect("/dashboard/people");
}

export default createBrowserRouter([
  {
    path: "/", Component: App,
    children: [
      {
        index: true,
        loader: HomePageLoader,
      },
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