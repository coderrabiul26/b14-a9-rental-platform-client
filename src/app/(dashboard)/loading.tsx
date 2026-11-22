import DashboardSkeleton from "@/components/skeletons/dashboard-skeleton";

/**
 * Instant loading UI for all dashboard pages
 * (`src/app/(dashboard)/dashboard/**`). Renders inside the dashboard
 * layout, so the sidebar + header stay visible while page data streams in.
 */
export default function Loading() {
  return <DashboardSkeleton />;
}