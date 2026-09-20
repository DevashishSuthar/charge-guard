import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import NotificationSetup from "@/components/NotificationSetup";

export default async function NotificationsPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  return <NotificationSetup />;
}