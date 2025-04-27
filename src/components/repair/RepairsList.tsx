
import { RepairRequest } from "@/types";
import { RepairCard } from "./RepairCard";

interface RepairsListProps {
  repairs: RepairRequest[];
}

export function RepairsList({ repairs }: RepairsListProps) {
  if (repairs.length === 0) {
    return (
      <div className="col-span-full text-center py-10 border rounded-md bg-gray-50">
        <p className="text-gray-500">ไม่พบรายการซ่อมที่ตรงกับเงื่อนไขการค้นหา</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {repairs.map((repair) => (
        <RepairCard key={repair.id} repair={repair} />
      ))}
    </div>
  );
}
