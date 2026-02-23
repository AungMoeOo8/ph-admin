import React from "react";
import { createBrowserRouter, MiddlewareFunction, redirect, RouteObject } from "react-router";
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
import App from "./App";
import DashboardLayout, { dashboardMiddleware } from "./layouts/DashboardLayout";
import { fetchFactory } from "./fetchFactory";
import { loginMiddleware } from "./pages/auth/LoginPage";
import BlogPage from "./pages/blog/BlogPage";
import AddBlogPage from "./pages/blog/AddBlogPage";
import AssetPage from "./pages/asset/AssetPage";
import AddAssetPage from "./pages/asset/AddAssetPage";
import BlogCategoryPage from "./pages/blog/BlogCategoryPage";
import EditBlogPage from "./pages/blog/EditBlogPage";

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

const BlogRoutes: RouteObject = {
  path: "blogs",
  children: [
    {
      index: true,
      Component: BlogPage
    },
    {
      path: "new",
      Component: AddBlogPage
    },
    {
      path: "categories",
      Component: BlogCategoryPage
    },
    {
      path: ":blogId",
      Component: EditBlogPage
    }
  ]
}

const AssetRoutes: RouteObject = {
  path: "assets",
  children: [
    {
      index: true,
      Component: AssetPage
    },
    {
      path: "new",
      Component: AddAssetPage
    }
  ]
}

const homePageMiddleware: MiddlewareFunction = ({ request }) => {
  const token = fetchFactory.getToken()
  if (!token) throw redirect(`/login`);

  const url = new URL(request.url);
  const from = url.searchParams.get("from") || "/dashboard";
  throw redirect(from);
}

const AuthMiddleware: MiddlewareFunction = async () => {
  try {
    const token = fetchFactory.getToken()

    // check if token exist on the first mount
    if (!token) {
      await fetchFactory.refreshAccessTokenAndExpiry()
    }

  } catch {
    console.log("Auth middleware catch")
  }

}

export const router = createBrowserRouter([
  {
    path: "/", Component: App,
    children: [
      {
        index: true,
        middleware: [AuthMiddleware, homePageMiddleware],
        loader: () => { }
      },
      {
        path: "/login",
        middleware: [AuthMiddleware, loginMiddleware],
        loader: () => { },
        Component: LoginPage,
      },
      {
        path: "dashboard",
        middleware: [AuthMiddleware, dashboardMiddleware],
        loader: () => { },
        Component: DashboardLayout,
        children: [
          PeopleRoutes,
          ServiceRoutes,
          CourseRoutes,
          ActivityRoutes,
          BlogRoutes,
          AssetRoutes
        ]
      }]
  }
])