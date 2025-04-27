
import { RepairRequest, RepairStatus, User } from "@/types";

export interface RepairMutations {
  addRepair: (repair: Omit<RepairRequest, "id" | "createdAt" | "updatedAt" | "requestedBy" | "status">) => void;
  updateRepairStatus: (id: string, status: RepairStatus, notes?: string) => void;
  assignRepair: (id: string, technician: User) => void;
  isAddingRepair: boolean;
  isUpdatingStatus: boolean;
  isAssigning: boolean;
}

export interface RepairQueries {
  repairs: RepairRequest[];
  isLoading: boolean;
  getRepairById: (id: string) => RepairRequest | undefined;
  refetch: () => Promise<any>;
  forceRefresh: () => Promise<any>; // Added the new force refresh function
  error: Error | null;
}

export interface RepairContextType extends RepairMutations, RepairQueries {}
