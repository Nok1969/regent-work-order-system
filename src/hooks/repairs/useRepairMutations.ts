
import { RepairRequest, RepairStatus, User } from "@/types";
import { useAddRepair } from "./mutations/useAddRepair";
import { useUpdateRepairStatus } from "./mutations/useUpdateRepairStatus";
import { useAssignRepair } from "./mutations/useAssignRepair";

export function useRepairMutations() {
  const addRepairMutation = useAddRepair();
  const updateRepairStatusMutation = useUpdateRepairStatus();
  const assignRepairMutation = useAssignRepair();

  return {
    addRepair: (repair: Omit<RepairRequest, "id" | "createdAt" | "updatedAt" | "requestedBy" | "status">) => 
      addRepairMutation.mutate(repair),
    updateRepairStatus: (id: string, status: RepairStatus, notes?: string) => 
      updateRepairStatusMutation.mutate({ id, status, notes }),
    assignRepair: (id: string, technician: User) => 
      assignRepairMutation.mutate({ id, technician }),
    isAddingRepair: addRepairMutation.isPending,
    isUpdatingStatus: updateRepairStatusMutation.isPending,
    isAssigning: assignRepairMutation.isPending
  };
}
