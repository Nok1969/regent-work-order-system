
import { useNotifications } from "@/contexts/NotificationContext";
import { 
  Bell, 
  BellRing, 
  Check, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";

interface NotificationItemProps {
  id: string;
  title: string;
  message: string;
  read: boolean;
  time: Date;
  link?: string;
  onMarkAsRead: (id: string) => void;
}

function NotificationItem({ 
  id, 
  title, 
  message, 
  read, 
  time, 
  link,
  onMarkAsRead 
}: NotificationItemProps) {
  return (
    <div className={cn(
      "flex items-start gap-2 p-3 transition-colors",
      read ? "bg-white" : "bg-blue-50",
      "border-b border-gray-100 last:border-0"
    )}>
      <div className="mt-1">
        {read ? (
          <Bell className="h-5 w-5 text-gray-400" />
        ) : (
          <BellRing className="h-5 w-5 text-blue-500" />
        )}
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{title}</p>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(time), { 
              addSuffix: true,
              locale: th
            })}
          </span>
        </div>
        <p className="text-sm text-gray-600">{message}</p>
        
        <div className="flex items-center justify-between pt-1">
          {link && (
            <Link to={link} className="text-xs text-blue-600 hover:underline flex items-center">
              ดูรายละเอียด
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          )}
          
          {!read && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs text-gray-500"
              onClick={() => onMarkAsRead(id)}
            >
              <Check className="h-3 w-3 mr-1" />
              อ่านแล้ว
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationList() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  if (notifications.length === 0) {
    return (
      <div className="p-6 text-center">
        <BellRing className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <h3 className="text-lg font-medium">ไม่มีการแจ้งเตือน</h3>
        <p className="text-sm text-gray-500">คุณจะได้รับการแจ้งเตือนเมื่อมีการอัพเดทงานซ่อม</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <h2 className="font-semibold">การแจ้งเตือน</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-sm"
          onClick={markAllAsRead}
        >
          <Check className="h-4 w-4 mr-1" />
          อ่านทั้งหมด
        </Button>
      </div>
      
      <ScrollArea className="max-h-[500px]">
        {notifications.map((notification) => (
          <NotificationItem 
            key={notification.id}
            id={notification.id}
            title={notification.title}
            message={notification.message}
            read={notification.read}
            time={notification.createdAt}
            link={notification.relatedTo ? `/repair/${notification.relatedTo}` : undefined}
            onMarkAsRead={markAsRead}
          />
        ))}
      </ScrollArea>
    </div>
  );
}
