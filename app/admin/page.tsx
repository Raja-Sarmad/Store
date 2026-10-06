import { redirect } from "next/navigation";
import { getAdminDashboardUrl } from "@/lib/api";

export default function AdminAliasPage() {
  redirect(getAdminDashboardUrl());
}
