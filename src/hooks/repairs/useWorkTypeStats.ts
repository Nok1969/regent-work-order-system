import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WorkTypeStat {
  work_type: string;
  count: number;
}

/**
 * Hook to fetch statistics about repair work types
 * Returns counts of repairs grouped by work_type
 */
export function useWorkTypeStats() {
  const fetchWorkTypeStats = async (): Promise<WorkTypeStat[]> => {
    // TypeScript workaround: Cast to 'any' to avoid the type error with 'group' method
    // The method exists at runtime but isn't properly typed in the generated types
    const { data, error } = await (supabase
      .from("repairs")
      .select("work_type, count(*)") as any)
      .group("work_type");

    if (error) throw error;
    return data || [];
  };

  return useQuery({
    queryKey: ["workTypeStats"],
    queryFn: fetchWorkTypeStats,
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
    refetchOnWindowFocus: true
  });
}