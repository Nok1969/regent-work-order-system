import { RepairRequest } from "@/types";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SimpleRepairsGridProps {
  repairs: RepairRequest[];
}

export function SimpleRepairsGrid({ repairs }: SimpleRepairsGridProps) {
  // Helper function to get appropriate status text
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

  // Helper function to get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "new":
        return "bg-blue-500 text-white";
      case "inProgress":
        return "bg-amber-500 text-white";
      case "completed":
        return "bg-emerald-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (repairs.length === 0) {
    return (
      <div className="col-span-full text-center py-10 border rounded-md bg-gray-50">
        <p className="text-gray-500">ไม่พบรายการซ่อมที่ตรงกับเงื่อนไขการค้นหา</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {repairs.map((repair) => (
        <Link key={repair.id} to={`/repair/${repair.id}`} className="no-underline">
          <div className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg mb-2 text-gray-900">{repair.title}</h3>
            <div className="flex justify-between items-center">
              <Badge className={cn("rounded-sm", getStatusColor(repair.status))}>
                {getStatusText(repair.status)}
              </Badge>
              <p className="text-sm text-gray-500">ห้อง {repair.roomNumber}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}