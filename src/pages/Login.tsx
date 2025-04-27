import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import AuthForm from "@/components/auth/AuthForm";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    
    setError(null);

    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    try {
      setIsLoading(true);
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("โปรดลองอีกครั้ง");
      }
    } catch (err) {
      console.error(err);
      setError("โปรดลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="destructive" className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isLoading && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>กำลังเข้าสู่ระบบ...</span>
          </div>
        </div>
      )}
      
      <AuthForm
        variant="login"
        onSubmit={handleSubmit}
      />
    </>
  );
}
