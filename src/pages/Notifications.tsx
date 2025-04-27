
import { useNotifications } from "@/contexts/NotificationContext";
import { NotificationList } from "@/components/notification/NotificationList";

export default function Notifications() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">การแจ้งเตือน</h1>
        <p className="text-muted-foreground">
          รายการแจ้งเตือนทั้งหมดในระบบ
        </p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <NotificationList />
      </div>
    </div>
  );
}
