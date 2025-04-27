export type UserRole = 'staff' | 'technician' | 'admin' | 'manager';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export type RepairStatus = 'new' | 'inProgress' | 'completed' | 'cancelled';

export interface RepairRequest {
  id: string;
  title: string;
  description: string;
  roomNumber: string;
  requestedBy: User;
  assignedTo?: User;
  status: RepairStatus;
  priority: 'low' | 'medium' | 'high';
  workType?: string; // Added workType property
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  notes?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  relatedTo?: string; // RepairRequest id
  forUsers: UserRole[];
}
