import type { LoaderFunctionArgs } from "react-router-dom";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { fakeAuthProvider } from "./auth";
import Home from "./pages/Home";
import ErrorPage from "./error-page";
import Register from "./pages/Register";
import { authLoader } from "./lib/authLoader";
import "./App.css";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader() {
      return { user: fakeAuthProvider.username };
    },
    errorElement: <ErrorPage />,
    Component: Home,
    // children: [
    //   {
    //     index: true,
    //     Component: PublicPage,
    //   },
    //   {
    //     path: "protected",
    //     loader: protectedLoader,
    //     Component: ProtectedPage,
    //   },
    // ],
  },
  {
    path: "auth",
    children: [
      {
        path: "login",
        Component: Login,
        loader: authLoader,
      },
      {
        path: "register",
        Component: Register,
        loader: authLoader,
      },
    ],
  },
  {
    path: "/logout",
    async action() {
      await fakeAuthProvider.signout();
      return redirect("/");
    },
  },
]);

export default function App() {
  return (
    <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  );
}

function protectedLoader({ request }: LoaderFunctionArgs) {
  if (!fakeAuthProvider.isAuthenticated) {
    let params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null;
}
