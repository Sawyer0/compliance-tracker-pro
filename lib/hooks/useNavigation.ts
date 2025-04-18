import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook for optimized navigation with data prefetching
 *
 * @param prefetchPatterns Optional route patterns to prefetch
 * @returns Navigation utilities
 */
export function useNavigation(prefetchPatterns?: string[]) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // Prefetch data for commonly accessed routes
  useEffect(() => {
    if (!prefetchPatterns?.length) return;

    // Prefetch data for common routes
    const prefetchRouteData = async (route: string) => {
      try {
        // For departments route, prefetch departments data
        if (route.includes("dashboard")) {
          queryClient.prefetchQuery({
            queryKey: ["departments"],
            staleTime: 60 * 1000, // 1 minute
          });
        }
      } catch (err) {
        // Silent fail for prefetching
        console.debug("Failed to prefetch data for route:", route, err);
      }
    };

    prefetchPatterns.forEach(prefetchRouteData);
  }, [prefetchPatterns, queryClient]);

  // Optimized navigation with transition and data prefetching
  const navigateTo = useCallback(
    (path: string) => {
      // Prefetch the destination page data before navigation
      if (path.includes("dashboard")) {
        queryClient.prefetchQuery({
          queryKey: ["departments"],
          staleTime: 60 * 1000, // 1 minute
        });
      } else if (path.includes("department")) {
        // Extract department ID from the path if available
        const deptId = path.split("/").pop();
        if (deptId) {
          queryClient.prefetchQuery({
            queryKey: ["checklists", deptId],
            staleTime: 60 * 1000, // 1 minute
          });
        }
      }

      // Navigate to the destination
      router.push(path);
    },
    [router, queryClient]
  );

  return {
    navigateTo,
    currentPath: pathname,
    router,
  };
}
