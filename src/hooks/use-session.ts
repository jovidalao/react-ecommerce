import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

/**
 * Custom hook to fetch and manage user session data.
 * @returns The result object from TanStack Query's useQuery for the session.
 */
export function useSession() {
  const trpc = useTRPC();
  const sessionQuery = useQuery(trpc.auth.session.queryOptions());
  return sessionQuery;
}