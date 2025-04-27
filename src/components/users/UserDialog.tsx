
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "./UserForm";
import { User, UserRole } from "@/types";

interface UserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: {
    username: string;
    name: string;
    role: UserRole;
    avatar: string;
  };
  setFormData: (data: UserDialogProps['formData']) => void;
  mode: 'add' | 'edit';
}

export function UserDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  formData, 
  setFormData,
  mode 
}: UserDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'เพิ่มผู้ใช้งานใหม่' : 'แก้ไขข้อมูลผู้ใช้'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'กรอกข้อมูลเพื่อเพิ่มผู้ใช้งานใหม่เข้าสู่ระบบ'
              : 'แก้ไขข้อมูลผู้ใช้งานในระบบ'
            }
          </DialogDescription>
        </DialogHeader>
        
        <UserForm formData={formData} setFormData={setFormData} />
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            ยกเลิก
          </Button>
          <Button onClick={onSubmit}>
            {mode === 'add' ? 'เพิ่มผู้ใช้' : 'บันทึกการแก้ไข'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
