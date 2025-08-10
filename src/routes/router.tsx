import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "src/pages/home";
import { ClassDetailPage } from "src/pages/class-detail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/:classId",
    element: <ClassDetailPage />
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
