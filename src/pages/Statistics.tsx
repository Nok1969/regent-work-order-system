import { useRepairs } from "@/contexts/RepairContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  Cell
} from "recharts";

const COLORS = {
  new: "#9b87f5",
  inProgress: "#F97316",
  completed: "#22c55e",
  cancelled: "#ef4444",
};

const STATUS_LABELS = {
  new: "รอดำเนินการ",
  inProgress: "กำลังดำเนินการ",
  completed: "เสร็จสิ้น",
  cancelled: "ยกเลิก",
};

const PRIORITY_COLORS = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

const PRIORITY_LABELS = {
  high: "เร่งด่วน",
  medium: "ปานกลาง",
  low: "ต่ำ",
};

const WORK_TYPE_COLORS = {
  plumbing: "#3b82f6", // Blue
  electrical: "#eab308", // Yellow
  hvac: "#06b6d4", // Cyan
  furniture: "#8b5cf6", // Purple
  other: "#94a3b8", // Slate
  sanitary: "#10b981", // Emerald
};

const WORK_TYPE_LABELS = {
  plumbing: "งานประปา",
  electrical: "งานไฟฟ้า",
  hvac: "งานแอร์",
  furniture: "งานเฟอร์นิเจอร์",
  other: "อื่น ๆ",
  sanitary: "งานสุขาภิบาล",
};

// Simple tooltip component without any complex props handling
const CustomTooltip = (props: any) => {
  const { active, payload } = props;
  
  if (!active || !payload || !payload.length) {
    return null;
  }
  
  return (
    <div className="bg-white p-2 border rounded shadow">
      <p>{`${payload[0].name}: ${payload[0].value} รายการ`}</p>
    </div>
  );
};

export default function Statistics() {
  const { repairs } = useRepairs();

  // Prepare data for status chart
  const statusData = Object.entries(
    repairs.reduce((acc, repair) => {
      acc[repair.status] = (acc[repair.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([status, count]) => ({
    name: STATUS_LABELS[status as keyof typeof STATUS_LABELS],
    value: count,
    status: status,
  }));

  // Prepare data for priority chart
  const priorityData = Object.entries(
    repairs.reduce((acc, repair) => {
      acc[repair.priority] = (acc[repair.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([priority, count]) => ({
    name: PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS],
    value: count,
    priority: priority,
  }));

  // Prepare data for work type chart
  const workTypeData = Object.entries(
    repairs.reduce((acc, repair) => {
      // Use "other" as default if workType is not defined
      const workType = repair.workType || "other";
      acc[workType] = (acc[workType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([workType, count]) => ({
    work_type: WORK_TYPE_LABELS[workType as keyof typeof WORK_TYPE_LABELS] || workType,
    count: count,
    workType: workType,
  }));

  console.log('Status Data:', statusData);
  console.log('Priority Data:', priorityData);
  console.log('Work Type Data:', workTypeData);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold tracking-tight mb-6">สรุปข้อมูลการแจ้งซ่อม</h1>
      
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">สถานะงานซ่อม</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[entry.status as keyof typeof COLORS]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  ไม่มีข้อมูล
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Priority Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ระดับความสำคัญ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {priorityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value">
                      {priorityData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={PRIORITY_COLORS[entry.priority as keyof typeof PRIORITY_COLORS]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  ไม่มีข้อมูล
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Work Type Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ประเภทงานซ่อม</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {workTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workTypeData}>
                  <XAxis dataKey="work_type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {workTypeData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={WORK_TYPE_COLORS[entry.workType as keyof typeof WORK_TYPE_COLORS] || "#94a3b8"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                ไม่มีข้อมูล
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
