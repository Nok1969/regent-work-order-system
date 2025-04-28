import React, { useState } from 'react';
import { RepairRequest } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, CheckCircle2, Play, XCircle, Image } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRepairs } from "@/contexts/RepairContext";
import { useToast } from "@/hooks/use-toast";
import { useMobile } from "@/hooks/use-mobile";
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
import { Textarea } from "@/components/ui/textarea";

interface RepairCardProps {
  repair: RepairRequest;
}

export function RepairCard({ repair }: RepairCardProps) {
  const { user } = useAuth();
  const { updateRepairStatus } = useRepairs();
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const isMobile = useMobile();

  // Debug logging to understand status change conditions
  console.log('RepairCard - User:', user);
  console.log('RepairCard - Repair:', repair);
  console.log('RepairCard - Assigned To:', repair.assignedTo);

  const canChangeStatus = user && (
    user.role === 'technician' || 
    user.role === 'manager' || 
    user.role === 'staff' || 
    (repair.assignedTo?.id === user.id)
  );

  // Additional debug logging for canChangeStatus
  console.log('RepairCard - canChangeStatus:', canChangeStatus);

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

  // Function to handle status change and show toast notification
  const handleStatusChange = (newStatus: string, statusNotes: string) => {
    updateRepairStatus(repair.id, newStatus as any, statusNotes);
    setNotes("");
    
    toast({
      title: "อัพเดตสถานะสำเร็จ",
      description: `สถานะของงานซ่อมได้เปลี่ยนเป็น ${getStatusText(newStatus)}`,
    });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
        <div className="w-full">
          <div className="flex flex-wrap gap-2 mb-1">
            <Badge variant="outline" className="rounded-sm border-none bg-gray-100">
              ห้อง {repair.roomNumber}
            </Badge>
            <Badge className={cn("rounded-sm", getPriorityColor(repair.priority))}>
              {getPriorityText(repair.priority)}
            </Badge>
            <Badge className={cn("rounded-sm", getStatusColor(repair.status))}>
              {getStatusText(repair.status)}
            </Badge>
            {repair.attachments && repair.attachments.length > 0 && (
              <Badge variant="outline" className="rounded-sm border-none bg-gray-100">
                <Image className="h-3 w-3 mr-1" />
                {repair.attachments.length}
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-semibold line-clamp-2">{repair.title}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-600 line-clamp-2">{repair.description}</p>
        
        <div className="mt-3 space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="truncate">
              แจ้งเมื่อ: {format(new Date(repair.createdAt), 'PPP', { locale: th })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 flex-shrink-0 text-gray-400" />
            <span className="truncate">
              ผู้แจ้ง: {repair.requestedBy.name}
            </span>
          </div>
          {repair.assignedTo && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <span className="truncate">
                ช่างผู้รับผิดชอบ: {repair.assignedTo.name}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          {canChangeStatus && repair.status !== "completed" && repair.status !== "cancelled" && (
            <>
              {repair.status === "new" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="secondary" className={isMobile ? "w-full text-xs px-2" : ""}>
                      <Play className="h-4 w-4 mr-1" />
                      {isMobile ? "เริ่ม" : "เริ่มดำเนินการ"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[90vw] md:max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>ยืนยันการเริ่มดำเนินการ</AlertDialogTitle>
                      <AlertDialogDescription>
                        คุณต้องการเริ่มดำเนินการงานซ่อมนี้ใช่หรือไม่?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Textarea
                      placeholder="บันทึกการซ่อม (ถ้ามี)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-4"
                    />
                    <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                      <AlertDialogCancel className="mt-2 sm:mt-0">ยกเลิก</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleStatusChange("inProgress", notes)} className="w-full sm:w-auto">
                        ยืนยัน
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
              {repair.status === "inProgress" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="secondary" className={isMobile ? "w-full text-xs px-2" : ""}>
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      {isMobile ? "เสร็จ" : "เสร็จสิ้น"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[90vw] md:max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>ยืนยันการเสร็จสิ้น</AlertDialogTitle>
                      <AlertDialogDescription>
                        คุณต้องการทำเครื่องหมายว่างานซ่อมนี้เสร็จสิ้นใช่หรือไม่?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Textarea
                      placeholder="บันทึกการซ่อม (ถ้ามี)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-4"
                    />
                    <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                      <AlertDialogCancel className="mt-2 sm:mt-0">ยกเลิก</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleStatusChange("completed", notes)} className="w-full sm:w-auto">
                        ยืนยัน
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </>
          )}
        </div>
        
        <Link to={`/repair/${repair.id}`} className={isMobile ? "w-full" : ""}>
          <Button variant="secondary" className={isMobile ? "w-full" : ""}>
            รายละเอียด
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
