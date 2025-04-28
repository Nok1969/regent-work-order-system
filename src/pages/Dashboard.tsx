import { useAuth } from "@/contexts/AuthContext";
import { useRepairs } from "@/contexts/RepairContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RepairCard } from "@/components/repair/RepairCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BarChart3,
  ClipboardList, 
  ClipboardCheck, 
  AlertTriangle, 
  Clock,
  Plus,
  UserPlus,
  Wrench,
  Loader2
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { repairs, isLoading } = useRepairs();

  // Show loading spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // Count repairs by status
  const newRepairs = repairs.filter(r => r.status === "new").length;
  const inProgressRepairs = repairs.filter(r => r.status === "inProgress").length;
  const completedRepairs = repairs.filter(r => r.status === "completed").length;
  const totalRepairs = repairs.length;

  // Get recent repairs
  const recentRepairs = [...repairs]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Get repairs assigned to current technician
  const technicianRepairs = user?.role === "technician" 
    ? repairs.filter(r => r.assignedTo?.id === user.id && r.status !== "completed")
    : [];

  // Get urgent repairs
  const urgentRepairs = repairs.filter(r => r.priority === "high" && r.status !== "completed");

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ยินดีต้อนรับ, {user?.name}</h1>
          <p className="text-muted-foreground">
            สรุปสถานะงานซ่อมทั้งหมดในระบบ
          </p>
        </div>

        {(user?.role === "staff" || user?.role === "manager") && (
          <Link to="/repair/new">
            <Button className="mt-4 md:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              แจ้งซ่อมใหม่
            </Button>
          </Link>
        )}
      </div>

      {user?.role === "manager" && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg border">
          <h2 className="text-xl font-semibold mb-3">แดชบอร์ดผู้จัดการ</h2>
          <Button className="mr-2">
            <UserPlus className="mr-2 h-4 w-4" />
            มอบหมายงาน
          </Button>
        </div>
      )}
      
      {user?.role === "technician" && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h2 className="text-xl font-semibold mb-3">งานที่ได้รับมอบหมาย</h2>
          <div className="grid gap-4 mt-3 md:grid-cols-2 lg:grid-cols-3">
            {technicianRepairs.length > 0 ? (
              technicianRepairs.map(repair => (
                <RepairCard key={repair.id} repair={repair} />
              ))
            ) : (
              <Card className="col-span-full bg-white">
                <CardContent className="pt-6 text-center">
                  <Wrench className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                  <p>ไม่มีงานที่ได้รับมอบหมายในขณะนี้</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รอดำเนินการ</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newRepairs}</div>
            <p className="text-xs text-muted-foreground">
              รายการที่รอการมอบหมาย
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กำลังดำเนินการ</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressRepairs}</div>
            <p className="text-xs text-muted-foreground">
              รายการที่กำลังดำเนินการ
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เสร็จสิ้น</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedRepairs}</div>
            <p className="text-xs text-muted-foreground">
              รายการที่เสร็จสิ้น
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายการทั้งหมด</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRepairs}</div>
            <p className="text-xs text-muted-foreground">
              รายการซ่อมทั้งหมดในระบบ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Simple Repairs Grid */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">รายการทั้งหมด</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {repairs.map((repair) => (
            <div key={repair.id} className="p-4 bg-white rounded-lg shadow">
              <h3 className="font-bold text-lg">{repair.title}</h3>
              <p className="text-sm text-muted-foreground">{repair.status}</p>
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="recent" className="mt-6">
        <TabsList>
          <TabsTrigger value="recent">
            <Clock className="mr-2 h-4 w-4" />
            รายการล่าสุด
          </TabsTrigger>
          
          {user?.role === "technician" && (
            <TabsTrigger value="assigned">
              <ClipboardList className="mr-2 h-4 w-4" />
              งานที่ได้รับมอบหมาย
            </TabsTrigger>
          )}
          
          <TabsTrigger value="urgent">
            <AlertTriangle className="mr-2 h-4 w-4" />
            งานเร่งด่วน
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentRepairs.length > 0 ? (
              recentRepairs.map(repair => (
                <RepairCard key={repair.id} repair={repair} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="pt-6 text-center">
                  <p>ไม่มีรายการซ่อมล่าสุด</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {user?.role === "technician" && (
          <TabsContent value="assigned" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {technicianRepairs.length > 0 ? (
                technicianRepairs.map(repair => (
                  <RepairCard key={repair.id} repair={repair} />
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="pt-6 text-center">
                    <p>ไม่มีงานที่ได้รับมอบหมายในขณะนี้</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="urgent" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {urgentRepairs.length > 0 ? (
              urgentRepairs.map(repair => (
                <RepairCard key={repair.id} repair={repair} />
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="pt-6 text-center">
                  <p>ไม่มีงานเร่งด่วนในขณะนี้</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
