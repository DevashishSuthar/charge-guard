import { TopNav } from "@/components/TopNav";

/**
 * Shell for the signed-in pages (dashboard, settings). The route group name
 * "(app)" doesn't appear in URLs.
 *
 * Because TopNav lives in a layout, Next.js keeps it mounted when you switch
 * between /dashboard and /settings — only {children} is swapped, and while the
 * next page is loading, the sibling loading.tsx (a skeleton) shows in its place.
 *
 * Auth stays in each page.tsx: layouts don't re-render on client-side
 * navigation, so a check here would only run on the first load.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <TopNav />
      {children}
    </div>
  );
}
