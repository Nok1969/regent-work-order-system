
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RepairStatus } from "@/types";
import { useNotifications } from "@/contexts/NotificationContext";

export function useUpdateRepairStatus() {
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: string, status: RepairStatus, notes?: string }) => {
      const updates: any = {
        status,
        notes: notes || undefined,
        updated_at: new Date().toISOString()
      };

      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('repairs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['repairs'] });
      
      let statusText = "";
      switch (data.status) {
        case "inProgress":
          statusText = "กำลังดำเนินการ";
          break;
        case "completed":
          statusText = "เสร็จสิ้นแล้ว";
          break;
        case "cancelled":
          statusText = "ถูกยกเลิก";
          break;
        default:
          statusText = data.status;
      }

      addNotification({
        title: "สถานะงานเปลี่ยนแปลง",
        message: `งานซ่อม${data.title} ในห้อง ${data.room_number} ${statusText}`,
        relatedTo: data.id,
        forUsers: ["staff", "manager"]
      });
    }
  });
}
