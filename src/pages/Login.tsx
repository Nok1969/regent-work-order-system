import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, X, Mail, Lock, Check } from "lucide-react";
import "./Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        setError("เข้าสู่ระบบไม่สำเร็จ โปรดลองอีกครั้ง");
      }
    } catch (err) {
      console.error(err);
      setError("เกิดข้อผิดพลาด โปรดลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRememberMe = () => {
    setRememberMe(!rememberMe);
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
      
      <div className="new-login-page">
        <div className="new-login-container">
          <button 
            className="close-button" 
            aria-label="ปิด"
            title="ปิด"
          >
            <X size={24} />
          </button>
          
          <div className="avatar-container">
            <div className="avatar-circle">
              <div className="avatar-placeholder"></div>
              <div className="avatar-body"></div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <Mail size={20} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="input-field">
              <Lock size={20} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="checkbox-container">
              <div className="remember-me">
                <div 
                  className="checkbox" 
                  role="checkbox" 
                  aria-checked={rememberMe ? "true" : "false"} // Corrected to use a boolean value
                  onClick={toggleRememberMe}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      toggleRememberMe();
                      e.preventDefault();
                    }
                  }}
                >
                  {rememberMe ? <Check size={16} /> : null}
                </div>
                Remember me
              </div>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
            
            <button type="submit" className="login-btn">
              LOGIN
            </button>
            
            <div className="signup-link">
              don't have an account yet? <a href="#">sign up now</a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
