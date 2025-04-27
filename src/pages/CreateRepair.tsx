import { useState } from "react";
import { useRepairs } from "@/contexts/RepairContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import WorkTypeDropdown from "@/components/repair/WorkTypeDropdown";

export default function CreateRepair() {
  const { addRepair, isAddingRepair, forceRefresh } = useRepairs();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [workType, setWorkType] = useState("other");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) {
      newErrors.title = "กรุณาระบุหัวข้อปัญหา";
    }
    
    if (!description.trim()) {
      newErrors.description = "กรุณาระบุรายละเอียดปัญหา";
    }
    
    if (!roomNumber.trim()) {
      newErrors.roomNumber = "กรุณาระบุหมายเลขห้อง";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      addRepair({
        title,
        description,
        roomNumber,
        priority,
        workType,
      });
      
      // Show success toast
      toast({
        title: "แจ้งซ่อมสำเร็จ",
        description: "รายการแจ้งซ่อมถูกบันทึกเรียบร้อยแล้ว",
        variant: "default"
      });
      
      // Wait a moment then force refresh data before navigating
      setTimeout(async () => {
        await forceRefresh();
        navigate("/repairs");
      }, 800);
      
    } catch (error) {
      console.error("Error creating repair:", error);
      setErrors({
        form: "เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง"
      });
    }
  };

  if (!user) {
    return <div>กรุณาเข้าสู่ระบบ</div>;
  }

  if (user.role !== "staff" && user.role !== "manager") {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            คุณไม่มีสิทธิ์ในการสร้างรายการแจ้งซ่อม
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-3xl">
      <div className="mb-6">
        <Button 
          variant="outline"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ย้อนกลับ
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">สร้างรายการแจ้งซ่อมใหม่</h1>
        <p className="text-muted-foreground">
          กรอกข้อมูลเพื่อแจ้งซ่อม
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>แจ้งซ่อม</CardTitle>
            <CardDescription>
              กรุณากรอกรายละเอียดปัญหาที่ต้องการแจ้งซ่อม
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {errors.form && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errors.form}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="title">หัวข้อปัญหา <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                placeholder="เช่น เครื่องปรับอากาศไม่ทำงาน"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">รายละเอียดปัญหา <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                placeholder="อธิบายรายละเอียดปัญหาเพิ่มเติม"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">หมายเลขห้อง <span className="text-red-500">*</span></Label>
                <Input
                  id="roomNumber"
                  placeholder="เช่น 101"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className={errors.roomNumber ? "border-red-500" : ""}
                />
                {errors.roomNumber && (
                  <p className="text-sm text-red-500">{errors.roomNumber}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">ความสำคัญ</Label>
                <Select
                  value={priority}
                  onValueChange={(value) => setPriority(value as "low" | "medium" | "high")}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="เลือกระดับความสำคัญ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">ต่ำ</SelectItem>
                    <SelectItem value="medium">ปานกลาง</SelectItem>
                    <SelectItem value="high">สูง</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <WorkTypeDropdown value={workType} onChange={setWorkType} />
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => navigate(-1)}
            >
              ยกเลิก
            </Button>
            <Button 
              type="submit"
              disabled={isAddingRepair}
            >
              {isAddingRepair ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
