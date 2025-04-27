
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AccessDenied() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">ไม่มีสิทธิ์เข้าถึง</h3>
            <p className="text-muted-foreground">
              คุณไม่มีสิทธิ์ในการเข้าถึงหน้าจัดการผู้ใช้งาน เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเข้าถึงได้
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
