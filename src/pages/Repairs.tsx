
import { useState, useEffect } from "react";
import { useRepairs } from "@/contexts/RepairContext";
import { RepairStatus } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { RepairsList } from "@/components/repair/RepairsList";
import { RepairFilters } from "@/components/repair/RepairFilters";
import { RepairsHeader } from "@/components/repair/RepairsHeader";

export default function Repairs() {
  const { repairs, isLoading, forceRefresh } = useRepairs();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<RepairStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "priority">("newest");

  // Force refresh data when component mounts or when window gets focus
  useEffect(() => {
    console.log("Repairs page mounted, refreshing data");
    forceRefresh();
    
    const handleFocus = () => {
      console.log("Window focused, refreshing repairs data");
      forceRefresh();
    };
    
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [forceRefresh]);

  const filteredRepairs = repairs.filter(repair => {
    const searchMatch = 
      repair.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.roomNumber.includes(searchTerm);
      
    const statusMatch = selectedStatus === "all" || repair.status === selectedStatus;
    
    return searchMatch && statusMatch;
  });

  const sortedRepairs = [...filteredRepairs].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <RepairsHeader user={user} />
      
      <RepairFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
          <TabsTrigger value="new">รอดำเนินการ</TabsTrigger>
          <TabsTrigger value="inProgress">กำลังดำเนินการ</TabsTrigger>
          <TabsTrigger value="completed">เสร็จสิ้น</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <RepairsList repairs={sortedRepairs} />
        </TabsContent>
        
        <TabsContent value="new" className="mt-4">
          <RepairsList repairs={sortedRepairs.filter(r => r.status === "new")} />
        </TabsContent>
        
        <TabsContent value="inProgress" className="mt-4">
          <RepairsList repairs={sortedRepairs.filter(r => r.status === "inProgress")} />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <RepairsList repairs={sortedRepairs.filter(r => r.status === "completed")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
