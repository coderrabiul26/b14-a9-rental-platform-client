import NotFoundState from "@/components/states/not-found-state";

/**
 * 404 UI for the authenticated (dashboard) route group — e.g. an unknown
 * `/dashboard/...` path. Renders inside the dashboard layout so the
 * sidebar + header remain accessible.
 */
export default function NotFound() {
  return <NotFoundState />;
}