"use server";

import { clearSessionCookie } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const logoutAction = async () => {
  await clearSessionCookie();
  redirect("/admin/login");
};
