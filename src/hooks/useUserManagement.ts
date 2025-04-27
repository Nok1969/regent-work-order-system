
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { User, UserRole } from "@/types";

interface UserFormData {
  username: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export function useUserManagement(initialUsers: User[]) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    name: "",
    role: "staff",
    avatar: ""
  });

  const handleAddUser = async () => {
    try {
      const { data, error } = await supabase.rpc('admin_create_user', {
        user_email: formData.username,
        user_password: 'TempPass123!',
        user_name: formData.name,
        user_role: formData.role
      });

      if (error) {
        toast.error("ไม่สามารถสร้างผู้ใช้งานได้", {
          description: error.message
        });
        return;
      }

      const newUserId = data;

      if (newUserId) {
        if (formData.avatar) {
          await supabase
            .from('profiles')
            .update({ avatar: formData.avatar })
            .eq('id', newUserId);
        }

        toast.success("สร้างผู้ใช้งานสำเร็จ", {
          description: `สร้างบัญชีสำหรับ ${formData.name} เรียบร้อย กรุณาแจ้งรหัสผ่านชั่วคราว (TempPass123!) ให้ผู้ใช้`
        });

        setIsAddUserDialogOpen(false);
        resetForm();

        const { data: newUserData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', newUserId)
          .single();

        if (newUserData) {
          const newUser: User = {
            id: newUserData.id,
            username: formData.username,
            name: newUserData.name || formData.name,
            role: newUserData.role as UserRole,
            avatar: newUserData.avatar || formData.avatar
          };

          setUsers([...users, newUser]);
        }
      }
    } catch (err) {
      console.error("เกิดข้อผิดพลาดในการสร้างผู้ใช้งาน", err);
      toast.error("เกิดข้อผิดพลาด", {
        description: "ไม่สามารถสร้างผู้ใช้งานได้ กรุณาลองใหม่อีกครั้ง"
      });
    }
  };

  const handleEditUser = () => {
    if (!editingUser) return;
    
    const updatedUsers = users.map(u => 
      u.id === editingUser.id ? 
        { 
          ...u, 
          username: formData.username,
          name: formData.name,
          role: formData.role,
          avatar: formData.avatar || u.avatar
        } : u
    );
    
    setUsers(updatedUsers);
    setIsEditUserDialogOpen(false);
    setEditingUser(null);
    resetForm();
  };

  const startEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      role: user.role,
      avatar: user.avatar || ""
    });
    setIsEditUserDialogOpen(true);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const resetForm = () => {
    setFormData({
      username: "",
      name: "",
      role: "staff",
      avatar: ""
    });
  };

  const filteredUsers = users.filter(
    user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    users: filteredUsers,
    searchTerm,
    setSearchTerm,
    isAddUserDialogOpen,
    setIsAddUserDialogOpen,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    formData,
    setFormData,
    handleAddUser,
    handleEditUser,
    startEditUser,
    handleDeleteUser,
    resetForm
  };
}
