import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { Settings } from "@/components/Settings";

export default async function SettingsPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  return <Settings />;
}
