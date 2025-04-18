import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

/**
 * Hook to monitor and log React Query performance metrics
 * Only active in development environment
 */
export function useQueryPerformanceMonitor() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    // Log cache stats every 10 seconds
    const interval = setInterval(() => {
      const cache = queryClient.getQueryCache();
      const queries = cache.getAll();

      // Group by query key prefix
      const queryGroups = queries.reduce((acc, query) => {
        const key = Array.isArray(query.queryKey)
          ? query.queryKey[0]
          : "unknown";

        if (!acc[key]) {
          acc[key] = {
            count: 0,
            stale: 0,
            active: 0,
            inactive: 0,
          };
        }

        acc[key].count++;
        if (query.isStale()) acc[key].stale++;
        if (query.isActive()) acc[key].active++;
        if (!query.isActive()) acc[key].inactive++;

        return acc;
      }, {} as Record<string, { count: number; stale: number; active: number; inactive: number }>);

      console.log("[Query Performance]", {
        totalQueries: queries.length,
        byGroup: queryGroups,
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [queryClient]);

  // Add this utility to detect slow queries
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    // Track query execution times
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === "updated" && event.query.state.status === "success") {
        // Calculate time difference and check fetch status separately
        const fetchEndTime = event.query.state.dataUpdatedAt;
        const fetchStartTime =
          event.query.state.dataUpdatedAt -
          (event.query.state.fetchStatus === "fetching" ? 1000 : 0); // Estimate 1 second if fetching
        const executionTime = fetchEndTime - fetchStartTime;

        // Log slow queries (taking > 1000ms)
        if (executionTime > 1000) {
          console.warn("[Slow Query]", {
            queryKey: event.query.queryKey,
            executionTime: `${executionTime}ms`,
            status: event.query.state.fetchStatus,
          });
        }
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  return null;
}
