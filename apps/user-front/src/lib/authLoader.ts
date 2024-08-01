import { fakeAuthProvider } from "../auth";
import { redirect } from "react-router-dom";

export async function authLoader() {
    if (fakeAuthProvider.isAuthenticated) {
        return redirect("/");
    }
    return null;
}