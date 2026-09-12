import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/auth";
import { Landing } from "@/components/Landing";

export default async function Home() {
  const userId = await getSessionUserId();
  if (userId) redirect("/dashboard");

  return <Landing />;
}