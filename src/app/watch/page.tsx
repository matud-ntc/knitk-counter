import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/session";
import WatchPairClient from "@/components/watch/WatchPairClient";

export default async function WatchPage() {
  const session = await getUserSession();
  if (!session?.user) redirect("/");
  return <WatchPairClient />;
}
