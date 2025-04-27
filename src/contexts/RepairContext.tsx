import { createContext, useContext, ReactNode } from "react";
import { useRepairQueries } from "@/hooks/repairs/useRepairQueries";
import { useRepairMutations } from "@/hooks/repairs/useRepairMutations";
import { RepairContextType } from "@/hooks/repairs/types";

const RepairContext = createContext<RepairContextType | undefined>(undefined);

// Custom hook to use the repair context
export function useRepairs() {
  const context = useContext(RepairContext);
  if (context === undefined) {
    throw new Error("useRepairs must be used within a RepairProvider");
  }
  return context;
}

// The provider component - making it the default export for Fast Refresh compatibility
export default function RepairProvider({ children }: { children: ReactNode }) {
  const { repairs, isLoading, getRepairById, refetch, forceRefresh, error } = useRepairQueries();
  const { 
    addRepair, 
    updateRepairStatus, 
    assignRepair, 
    isAddingRepair, 
    isUpdatingStatus, 
    isAssigning 
  } = useRepairMutations();

  return (
    <RepairContext.Provider value={{
      repairs,
      getRepairById,
      addRepair,
      updateRepairStatus,
      assignRepair,
      isLoading,
      refetch,
      forceRefresh,
      error,
      isAddingRepair,
      isUpdatingStatus,
      isAssigning
    }}>
      {children}
    </RepairContext.Provider>
  );
}
