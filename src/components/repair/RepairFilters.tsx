
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RepairStatus } from "@/types";

interface RepairFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedStatus: RepairStatus | "all";
  setSelectedStatus: (status: RepairStatus | "all") => void;
  sortBy: "newest" | "oldest" | "priority";
  setSortBy: (sort: "newest" | "oldest" | "priority") => void;
}

export function RepairFilters({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy
}: RepairFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="ค้นหารายการซ่อม..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value as RepairStatus | "all")}
        >
          <SelectTrigger className="min-w-[180px]">
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="new">รอดำเนินการ</SelectItem>
            <SelectItem value="inProgress">กำลังดำเนินการ</SelectItem>
            <SelectItem value="completed">เสร็จสิ้น</SelectItem>
            <SelectItem value="cancelled">ยกเลิก</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as "newest" | "oldest" | "priority")}
        >
          <SelectTrigger className="min-w-[180px]">
            <SelectValue placeholder="เรียงตาม" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">ล่าสุด</SelectItem>
            <SelectItem value="oldest">เก่าสุด</SelectItem>
            <SelectItem value="priority">ความสำคัญ</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
