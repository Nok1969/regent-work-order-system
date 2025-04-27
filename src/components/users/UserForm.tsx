
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types";

interface UserFormProps {
  formData: {
    username: string;
    name: string;
    role: UserRole;
    avatar: string;
  };
  setFormData: (data: UserFormProps['formData']) => void;
}

export function UserForm({ formData, setFormData }: UserFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="username">ชื่อผู้ใช้</Label>
        <Input
          id="username"
          placeholder="เช่น user1"
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="name">ชื่อ-นามสกุล</Label>
        <Input
          id="name"
          placeholder="เช่น สมชาย ใจดี"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="role">บทบาท</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({...formData, role: value as UserRole})}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="เลือกบทบาท" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="staff">พนักงาน</SelectItem>
            <SelectItem value="technician">ช่างเทคนิค</SelectItem>
            <SelectItem value="manager">ผู้จัดการ</SelectItem>
            <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="avatar">URL รูปโปรไฟล์ (ไม่บังคับ)</Label>
        <Input
          id="avatar"
          placeholder="เช่น https://example.com/avatar.jpg"
          value={formData.avatar}
          onChange={(e) => setFormData({...formData, avatar: e.target.value})}
        />
      </div>
    </div>
  );
}
