
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { useNotifications } from "@/contexts/NotificationContext";

export function useAssignRepair() {
  const { addNotification } = useNotifications();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, technician }: { id: string, technician: User }) => {
      const { data, error } = await supabase
        .from('repairs')
        .update({
          assigned_to: technician.id,
          status: 'inProgress',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['repairs'] });
      addNotification({
        title: "งานซ่อมได้รับมอบหมาย",
        message: `คุณได้รับมอบหมายให้ซ่อม${data.title} ในห้อง ${data.room_number}`,
        relatedTo: data.id,
        forUsers: ["technician", "manager"]
      });
    }
  });
}
