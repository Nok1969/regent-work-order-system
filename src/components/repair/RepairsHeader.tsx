
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { User } from "@/types";

interface RepairsHeaderProps {
  user: User | null;
}

export function RepairsHeader({ user }: RepairsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">รายการแจ้งซ่อม</h1>
        <p className="text-muted-foreground">
          รายการงานซ่อมทั้งหมดในระบบ
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
  );
}
