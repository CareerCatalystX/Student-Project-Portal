import { redirect } from "next/navigation";

export function redirectToLogin() {
    redirect("/login");
}
