
import { mockUsers } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AccessDenied } from "@/components/users/AccessDenied";
import { UserTable } from "@/components/users/UserTable";
import { UserDialog } from "@/components/users/UserDialog";
import { UserHeader } from "@/components/users/UserHeader";
import { UserSearch } from "@/components/users/UserSearch";
import { useUserManagement } from "@/hooks/useUserManagement";

export default function Users() {
  const { user } = useAuth();
  const {
    users,
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
  } = useUserManagement(mockUsers);

  if (user?.role !== "admin") {
    return <AccessDenied />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <UserHeader 
        onAddUser={() => {
          resetForm();
          setIsAddUserDialogOpen(true);
        }}
      />

      <Card>
        <CardHeader className="px-6 pb-2">
          <UserSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </CardHeader>
        <CardContent className="px-6">
          <UserTable 
            users={users}
            onEdit={startEditUser}
            onDelete={handleDeleteUser}
          />
        </CardContent>
      </Card>

      <UserDialog
        isOpen={isAddUserDialogOpen}
        onClose={() => {
          setIsAddUserDialogOpen(false);
          resetForm();
        }}
        onSubmit={handleAddUser}
        formData={formData}
        setFormData={setFormData}
        mode="add"
      />

      <UserDialog
        isOpen={isEditUserDialogOpen}
        onClose={() => {
          setIsEditUserDialogOpen(false);
          resetForm();
        }}
        onSubmit={handleEditUser}
        formData={formData}
        setFormData={setFormData}
        mode="edit"
      />
    </div>
  );
}
