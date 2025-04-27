import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RepairRequest } from "@/types";
import { useNotifications } from "@/contexts/NotificationContext";
import { useToast } from "@/hooks/use-toast";

export function useAddRepair() {
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (repairData: Omit<RepairRequest, "id" | "createdAt" | "updatedAt" | "requestedBy" | "status">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('repairs')
        .insert({
          title: repairData.title,
          description: repairData.description,
          room_number: repairData.roomNumber,
          priority: repairData.priority,
          status: 'new',
          requested_by: user.id,
          work_type: repairData.workType, // Add the work type
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log("Repair added successfully:", data);
      
      // Immediately invalidate the repairs query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['repairs'] });
      
      toast({
        title: "แจ้งซ่อมสำเร็จ",
        description: "รายการแจ้งซ่อมถูกบันทึกเรียบร้อยแล้ว"
      });
      
      addNotification({
        title: "งานซ่อมใหม่",
        message: `มีงานซ่อมใหม่: ${data.title} ในห้อง ${data.room_number}`,
        relatedTo: data.id,
        forUsers: ["technician", "manager"]
      });
    },
    onError: (error) => {
      console.error("Error creating repair:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกรายการแจ้งซ่อมได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive"
      });
    }
  });
}
