import { redirect } from "next/navigation";
import { getAdminDashboardUrl } from "@/lib/api";

export default function AdminDashboardRedirectPage() {
  redirect(getAdminDashboardUrl());
}
