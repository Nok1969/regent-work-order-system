
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRepairs } from "@/contexts/RepairContext";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  User, 
  Home,
  AlarmClock,
  CheckCircle2,
  XCircle,
  Edit,
  CheckCircle,
  Save,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockUsers } from "@/data/mockData";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
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
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { RepairStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function RepairDetail() {
  const { id } = useParams<{ id: string }>();
  const { repairs, getRepairById, updateRepairStatus, assignRepair } = useRepairs();
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const repair = getRepairById(id!);
  
  const [editingStatus, setEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<RepairStatus | "">("");
  const [notes, setNotes] = useState("");
  const [editingAssignment, setEditingAssignment] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState("");

  // Debug log to see user and repair info
  console.log("RepairDetail - User:", user);
  console.log("RepairDetail - Repair:", repair);
  
  const canChangeStatus = user && (
    user.role === "technician" || 
    user.role === "manager" || 
    user.role === "staff" || 
    (repair?.assignedTo?.id === user.id)
  );
  
  // Debug log to track canChangeStatus
  console.log("RepairDetail - canChangeStatus:", canChangeStatus);
  
  const canAssignTechnician = user && (
    user.role === "manager"
  );

  const technicians = mockUsers.filter(
    user => user.role === "technician" || user.role === "manager"
  );

  if (!repair) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">ไม่พบรายการซ่อม</h1>
        <p className="mb-4">ไม่พบรายการซ่อมที่คุณต้องการดู</p>
        <Button onClick={() => navigate("/repairs")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับไปยังรายการซ่อม
        </Button>
      </div>
    );
  }

  const handleStatusChange = () => {
    if (!selectedStatus) return;
    
    updateRepairStatus(repair.id, selectedStatus, notes);
    setEditingStatus(false);
    
    toast({
      title: "อัพเดตสถานะสำเร็จ",
      description: `สถานะของงานซ่อมได้เปลี่ยนเป็น ${getStatusText(selectedStatus)}`,
    });
  };

  const handleAssignTechnician = () => {
    if (!selectedTechnician) return;
    
    const technician = mockUsers.find(user => user.id === selectedTechnician);
    if (technician) {
      assignRepair(repair.id, technician);
      setEditingAssignment(false);
      
      toast({
        title: "มอบหมายงานสำเร็จ",
        description: `มอบหมายงานให้กับ ${technician.name} เรียบร้อยแล้ว`,
      });
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "new":
        return "bg-repair-new text-white";
      case "inProgress":
        return "bg-repair-inProgress text-white";
      case "completed":
        return "bg-repair-completed text-white";
      case "cancelled":
        return "bg-repair-cancelled text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "new":
        return "รอดำเนินการ";
      case "inProgress":
        return "กำลังดำเนินการ";
      case "completed":
        return "เสร็จสิ้น";
      case "cancelled":
        return "ยกเลิก";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-amber-500 text-white";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getPriorityText = (priority: string): string => {
    switch (priority) {
      case "high":
        return "สูง";
      case "medium":
        return "ปานกลาง";
      case "low":
        return "ต่ำ";
      default:
        return priority;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <div className="mb-6">
        <Button 
          variant="outline"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ย้อนกลับ
        </Button>
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{repair.title}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge className={cn("rounded-sm", getStatusColor(repair.status))}>
                {getStatusText(repair.status)}
              </Badge>
              
              <Badge className={cn("rounded-sm", getPriorityColor(repair.priority))}>
                ความสำคัญ: {getPriorityText(repair.priority)}
              </Badge>
              
              <Badge variant="outline" className="rounded-sm">
                ห้อง {repair.roomNumber}
              </Badge>
            </div>
          </div>
          
          {/* ปุ่มเปลี่ยนสถานะงาน - เพิ่มเงื่อนไขเพื่อแสดงปุ่มที่เหมาะสมกับสถานะปัจจุบัน */}
          {canChangeStatus && (
            <div className="mt-4 sm:mt-0 flex gap-2">
              {repair.status === "new" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="default" size="sm">
                      <Play className="mr-2 h-4 w-4" />
                      เริ่มดำเนินการ
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>ยืนยันการเปลี่ยนสถานะงาน</AlertDialogTitle>
                      <AlertDialogDescription>
                        คุณต้องการเปลี่ยนสถานะงานซ่อมนี้เป็น "กำลังดำเนินการ" ใช่หรือไม่?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Textarea
                      placeholder="บันทึกการซ่อม (ถ้ามี)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-4"
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                      <AlertDialogAction onClick={() => updateRepairStatus(repair.id, "inProgress", notes)}>
                        ยืนยัน
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
              {repair.status === "inProgress" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="default" size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      ทำเครื่องหมายว่าเสร็จสิ้น
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>ยืนยันการเปลี่ยนสถานะงาน</AlertDialogTitle>
                      <AlertDialogDescription>
                        คุณต้องการเปลี่ยนสถานะงานซ่อมนี้เป็น "เสร็จสิ้น" ใช่หรือไม่?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Textarea
                      placeholder="บันทึกการซ่อม (ถ้ามี)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-4"
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                      <AlertDialogAction onClick={() => updateRepairStatus(repair.id, "completed", notes)}>
                        ยืนยัน
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2 pt-4">
              <h3 className="text-lg font-medium">รายละเอียด</h3>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{repair.description}</p>
            </CardContent>
          </Card>

          {(repair.notes || editingStatus) && (
            <Card>
              <CardHeader className="pb-2 pt-4 flex flex-row justify-between">
                <h3 className="text-lg font-medium">บันทึกการซ่อม</h3>
                
                {canChangeStatus && !editingStatus && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setEditingStatus(true);
                      setSelectedStatus(repair.status);
                      setNotes(repair.notes || "");
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    แก้ไข
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {editingStatus ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">สถานะ</label>
                      <Select
                        value={selectedStatus}
                        onValueChange={(value) => setSelectedStatus(value as RepairStatus)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกสถานะ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">รอดำเนินการ</SelectItem>
                          <SelectItem value="inProgress">กำลังดำเนินการ</SelectItem>
                          <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                          <SelectItem value="cancelled">ยกเลิก</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">บันทึก</label>
                      <Textarea
                        placeholder="บันทึกรายละเอียดการซ่อม"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-line">{repair.notes || "ไม่มีบันทึกเพิ่มเติม"}</p>
                )}
              </CardContent>
              
              {editingStatus && (
                <CardFooter>
                  <div className="flex justify-end gap-2 w-full">
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingStatus(false)}
                    >
                      ยกเลิก
                    </Button>
                    <Button onClick={handleStatusChange}>
                      <Save className="mr-2 h-4 w-4" />
                      บันทึก
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          )}
          
          {!repair.notes && !editingStatus && canChangeStatus && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setEditingStatus(true);
                setSelectedStatus(repair.status);
                setNotes("");
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              เพิ่มบันทึกการซ่อม
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2 pt-4">
              <h3 className="text-lg font-medium">ข้อมูลงานซ่อม</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <p>
                    <span className="text-gray-500 mr-2">แจ้งเมื่อ:</span>
                    {format(new Date(repair.createdAt), 'PPP เวลา HH:mm น.', { locale: th })}
                  </p>
                </div>
                
                <div className="flex items-center text-sm">
                  <User className="mr-2 h-4 w-4 text-gray-500" />
                  <p>
                    <span className="text-gray-500 mr-2">ผู้แจ้ง:</span>
                    {repair.requestedBy.name}
                  </p>
                </div>
                
                <div className="flex items-center text-sm">
                  <Home className="mr-2 h-4 w-4 text-gray-500" />
                  <p>
                    <span className="text-gray-500 mr-2">ห้อง:</span>
                    {repair.roomNumber}
                  </p>
                </div>
                
                {repair.status === "completed" && repair.completedAt && (
                  <div className="flex items-center text-sm">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                    <p>
                      <span className="text-gray-500 mr-2">เสร็จสิ้นเมื่อ:</span>
                      {format(new Date(repair.completedAt), 'PPP เวลา HH:mm น.', { locale: th })}
                    </p>
                  </div>
                )}
                
                {repair.status === "cancelled" && (
                  <div className="flex items-center text-sm">
                    <XCircle className="mr-2 h-4 w-4 text-red-500" />
                    <p>
                      <span className="text-gray-500 mr-2">ยกเลิกเมื่อ:</span>
                      {format(new Date(repair.updatedAt), 'PPP เวลา HH:mm น.', { locale: th })}
                    </p>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">ช่างผู้รับผิดชอบ</h4>
                  
                  {canAssignTechnician && !editingAssignment && repair.status !== "completed" && repair.status !== "cancelled" && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setEditingAssignment(true);
                        setSelectedTechnician(repair.assignedTo?.id || "");
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      แก้ไข
                    </Button>
                  )}
                </div>
                
                {editingAssignment ? (
                  <div className="space-y-3">
                    <Select
                      value={selectedTechnician}
                      onValueChange={setSelectedTechnician}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกช่างผู้รับผิดชอบ" />
                      </SelectTrigger>
                      <SelectContent>
                        {technicians.map(tech => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name} ({tech.role === "technician" ? "ช่าง" : "ผู้จัดการ"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingAssignment(false)}
                      >
                        ยกเลิก
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleAssignTechnician}
                      >
                        บันทึก
                      </Button>
                    </div>
                  </div>
                ) : repair.assignedTo ? (
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={repair.assignedTo.avatar} />
                      <AvatarFallback>
                        {repair.assignedTo.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{repair.assignedTo.name}</p>
                      <p className="text-sm text-gray-500 capitalize">
                        {repair.assignedTo.role === "technician" ? "ช่าง" : "ผู้จัดการ"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">ยังไม่ได้มอบหมาย</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {!editingStatus && canChangeStatus && repair.status !== "completed" && repair.status !== "cancelled" && !repair.notes && (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setEditingStatus(true);
                setSelectedStatus(repair.status);
                setNotes("");
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              เพิ่มบันทึกการซ่อม
            </Button>
          )}
          
          {!editingStatus && hasPermission(["manager"]) && repair.status !== "completed" && repair.status !== "cancelled" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  ยกเลิกงานซ่อมนี้
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>ยืนยันการยกเลิกงานซ่อม</AlertDialogTitle>
                  <AlertDialogDescription>
                    คุณต้องการยกเลิกงานซ่อมนี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Textarea
                  placeholder="ระบุเหตุผลในการยกเลิก"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-4"
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600"
                    onClick={() => updateRepairStatus(repair.id, "cancelled", notes)}
                  >
                    ยืนยันการยกเลิก
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
