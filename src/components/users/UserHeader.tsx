
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

interface UserHeaderProps {
  onAddUser: () => void;
}

export function UserHeader({ onAddUser }: UserHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">จัดการผู้ใช้งาน</h1>
        <p className="text-muted-foreground">
          เพิ่ม แก้ไข หรือลบผู้ใช้งานในระบบ
        </p>
      </div>
      
      <Button 
        className="mt-4 md:mt-0"
        onClick={onAddUser}
      >
        <UserPlus className="mr-2 h-4 w-4" />
        เพิ่มผู้ใช้งาน
      </Button>
    </div>
  );
}
