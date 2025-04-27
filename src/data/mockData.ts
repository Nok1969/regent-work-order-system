
import { Notification, RepairRequest, User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "user1",
    username: "staff1",
    name: "พนักงาน ทั่วไป",
    role: "staff",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "user2",
    username: "tech1",
    name: "ช่าง หนึ่ง",
    role: "technician",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "user3",
    username: "tech2",
    name: "ช่าง สอง",
    role: "technician",
    avatar: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "user4",
    username: "manager1",
    name: "ผู้จัดการ ฝ่ายซ่อมบำรุง",
    role: "manager",
    avatar: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: "user5",
    username: "admin1",
    name: "ผู้ดูแล ระบบ",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?img=5"
  }
];

export const mockRepairs: RepairRequest[] = [
  {
    id: "repair1",
    title: "เครื่องปรับอากาศไม่ทำงาน",
    description: "เครื่องปรับอากาศในห้อง 101 ไม่สามารถเปิดได้ แขกร้องเรียนเรื่องอากาศร้อน",
    roomNumber: "101",
    requestedBy: mockUsers[0],
    assignedTo: mockUsers[1],
    status: "inProgress",
    priority: "high",
    createdAt: new Date("2025-04-17T10:00:00"),
    updatedAt: new Date("2025-04-17T10:30:00"),
    notes: "ช่างกำลังตรวจสอบเครื่องปรับอากาศ"
  },
  {
    id: "repair2",
    title: "ห้องน้ำท่อรั่ว",
    description: "มีน้ำรั่วจากท่อใต้อ่างล้างหน้าในห้อง 205",
    roomNumber: "205",
    requestedBy: mockUsers[0],
    status: "new",
    priority: "medium",
    createdAt: new Date("2025-04-18T09:15:00"),
    updatedAt: new Date("2025-04-18T09:15:00")
  },
  {
    id: "repair3",
    title: "โทรทัศน์ไม่มีสัญญาณ",
    description: "แขกแจ้งว่าโทรทัศน์ในห้อง 308 ไม่มีสัญญาณ หน้าจอเป็นสีฟ้า",
    roomNumber: "308",
    requestedBy: mockUsers[3],
    assignedTo: mockUsers[2],
    status: "completed",
    priority: "low",
    createdAt: new Date("2025-04-16T14:20:00"),
    updatedAt: new Date("2025-04-16T16:45:00"),
    completedAt: new Date("2025-04-16T16:45:00"),
    notes: "เปลี่ยนสายสัญญาณใหม่ ทดสอบแล้วปกติ"
  },
  {
    id: "repair4",
    title: "ประตูห้องพักล็อคไม่ได้",
    description: "กลอนประตูห้อง 412 มีปัญหา ไม่สามารถล็อคได้",
    roomNumber: "412",
    requestedBy: mockUsers[0],
    status: "new",
    priority: "high",
    createdAt: new Date("2025-04-18T08:30:00"),
    updatedAt: new Date("2025-04-18T08:30:00")
  },
  {
    id: "repair5",
    title: "ไฟในห้องพักดับ",
    description: "ไฟในห้อง 520 ดับทั้งห้อง น่าจะเกิดจากฟิวส์ขาด",
    roomNumber: "520",
    requestedBy: mockUsers[3],
    assignedTo: mockUsers[1],
    status: "completed",
    priority: "high",
    createdAt: new Date("2025-04-15T20:10:00"),
    updatedAt: new Date("2025-04-15T21:30:00"),
    completedAt: new Date("2025-04-15T21:30:00"),
    notes: "เปลี่ยนฟิวส์ใหม่ ระบบไฟฟ้ากลับมาทำงานปกติ"
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "notif1",
    title: "งานซ่อมใหม่",
    message: "มีงานซ่อมใหม่: เครื่องปรับอากาศไม่ทำงานในห้อง 101",
    read: false,
    createdAt: new Date("2025-04-17T10:00:00"),
    relatedTo: "repair1",
    forUsers: ["technician", "manager"]
  },
  {
    id: "notif2",
    title: "สถานะงานเปลี่ยนแปลง",
    message: "งานซ่อมเครื่องปรับอากาศในห้อง 101 กำลังดำเนินการ",
    read: true,
    createdAt: new Date("2025-04-17T10:30:00"),
    relatedTo: "repair1",
    forUsers: ["staff", "manager"]
  },
  {
    id: "notif3",
    title: "งานซ่อมใหม่",
    message: "มีงานซ่อมใหม่: ห้องน้ำท่อรั่วในห้อง 205",
    read: false,
    createdAt: new Date("2025-04-18T09:15:00"),
    relatedTo: "repair2",
    forUsers: ["technician", "manager"]
  },
  {
    id: "notif4",
    title: "งานซ่อมเสร็จสิ้น",
    message: "งานซ่อมโทรทัศน์ในห้อง 308 เสร็จสิ้นแล้ว",
    read: false,
    createdAt: new Date("2025-04-16T16:45:00"),
    relatedTo: "repair3",
    forUsers: ["staff", "manager"]
  },
  {
    id: "notif5",
    title: "งานซ่อมใหม่ (ด่วน)",
    message: "มีงานซ่อมใหม่ (ด่วน): ประตูห้องพักล็อคไม่ได้ในห้อง 412",
    read: false,
    createdAt: new Date("2025-04-18T08:30:00"),
    relatedTo: "repair4",
    forUsers: ["technician", "manager"]
  }
];
