
import { CameraCapture } from "@/components/camera/CameraCapture";

export default function Index() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ทดสอบกล้อง</h1>
      <CameraCapture />
    </div>
  );
}
