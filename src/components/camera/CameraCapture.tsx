
import React from 'react';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Button } from "@/components/ui/button";
import { Camera as CameraIcon, CameraOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CameraCapture() {
  const { toast } = useToast();
  const [photo, setPhoto] = React.useState<string | null>(null);

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64
      });

      if (image.base64String) {
        setPhoto(`data:image/jpeg;base64,${image.base64String}`);
        toast({
          title: "สำเร็จ",
          description: "ถ่ายภาพสำเร็จ",
        });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถถ่ายภาพได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <Button onClick={takePhoto} variant="outline" size="lg">
        {photo ? <CameraOff className="mr-2" /> : <CameraIcon className="mr-2" />}
        {photo ? 'ถ่ายภาพใหม่' : 'ถ่ายภาพ'}
      </Button>
      
      {photo && (
        <div className="mt-4">
          <img 
            src={photo} 
            alt="ภาพที่ถ่าย" 
            className="max-w-sm rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
