
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, UserRole } from "@/types";
import { Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-purple-500 text-white";
      case "manager":
        return "bg-blue-500 text-white";
      case "technician":
        return "bg-amber-500 text-white";
      case "staff":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "ผู้ดูแลระบบ";
      case "manager":
        return "ผู้จัดการ";
      case "technician":
        return "ช่างเทคนิค";
      case "staff":
        return "พนักงาน";
      default:
        return role;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ผู้ใช้งาน</TableHead>
          <TableHead>ชื่อผู้ใช้</TableHead>
          <TableHead>บทบาท</TableHead>
          <TableHead className="text-right">จัดการ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length > 0 ? (
          users.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name}</span>
                </div>
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>
                <Badge className={getRoleBadgeColor(user.role)}>
                  {getRoleText(user.role)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(user)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">แก้ไข</span>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">ลบ</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบผู้ใช้งาน</AlertDialogTitle>
                        <AlertDialogDescription>
                          คุณแน่ใจหรือไม่ว่าต้องการลบ "{user.name}" ออกจากระบบ การกระทำนี้ไม่สามารถย้อนกลับได้
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(user.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          ลบผู้ใช้
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-6">
              <p className="text-muted-foreground">ไม่พบผู้ใช้งานที่ตรงกับเงื่อนไขการค้นหา</p>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
