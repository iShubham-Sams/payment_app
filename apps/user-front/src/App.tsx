import type { LoaderFunctionArgs } from "react-router-dom";
import {
  Form,
  RouterProvider,
  createBrowserRouter,
  redirect,
  useActionData,
  useLocation,
  useNavigation,
} from "react-router-dom";
import { fakeAuthProvider } from "./auth";
import HomePage from "./pages/HomePage";
import ErrorPage from "./error-page";
import Register from "./pages/Register";
import { authLoader } from "./lib/authLoader";
import "./App.css";

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader() {
      return { user: fakeAuthProvider.username };
    },
    errorElement: <ErrorPage />,
    Component: HomePage,
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
        Component: LoginPage,
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

function LoginPage() {
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let from = params.get("from") || "/";

  let navigation = useNavigation();
  let isLoggingIn = navigation.formData?.get("username") != null;

  let actionData = useActionData() as { error: string } | undefined;

  return (
    <div>
      <p>You must log in to view the page at {from}</p>

      <Form method="post" replace>
        <input type="hidden" name="redirectTo" value={from} />
        <label>
          Username: <input name="username" />
        </label>{" "}
        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? "Logging in..." : "Login"}
        </button>
        {actionData && actionData.error ? (
          <p style={{ color: "red" }}>{actionData.error}</p>
        ) : null}
      </Form>
    </div>
  );
}

function protectedLoader({ request }: LoaderFunctionArgs) {
  // If the user is not logged in and tries to access `/protected`, we redirect
  // them to `/login` with a `from` parameter that allows login to redirect back
  // to this page upon successful authentication
  if (!fakeAuthProvider.isAuthenticated) {
    let params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  return null;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}
