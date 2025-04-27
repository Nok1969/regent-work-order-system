import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import "./AuthForm.css";

interface AuthFormProps {
  variant: "login" | "register";
  onSubmit: (data: FormData) => void;
}

export default function AuthForm({ variant, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    onSubmit(formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-overlay"></div>
      <div className="auth-form-wrapper">
        <Card className="w-full max-w-md mx-auto bg-white/95 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Regent Work Order System
            </CardTitle>
            <CardDescription className="text-center">
              {variant === "login" ? "เข้าสู่ระบบ" : "สร้างบัญชีผู้ใช้"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="อีเมล" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="รหัสผ่าน" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {variant === "login" ? "เข้าสู่ระบบ" : "สร้างบัญชี"}
              </Button>
            </form>
          </CardContent>
          {variant === "register" && (
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-500">
                มีบัญชีอยู่แล้ว?{" "}
                <a href="/login" className="text-primary font-medium hover:underline">
                  เข้าสู่ระบบ
                </a>
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}