"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Terminal,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { workerApi } from "@/lib/api";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Silakan masukkan email dan password.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Memvalidasi kredensial pengguna...");

    try {
      const res = await workerApi.login({
        email: email.trim(),
        password: password.trim(),
      });

      if (res && res.success) {
        // Simpan sesi autentikasi ke localStorage
        localStorage.setItem("auth_token", res.token);
        localStorage.setItem("auth_user", JSON.stringify(res.user));

        toast.success(`Selamat datang kembali, ${res.user.name}!`, { id: toastId });
        router.push("/");
      } else {
        toast.error("Login gagal. Silakan periksa kredensial Anda.", { id: toastId });
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menghubungi server autentikasi.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#FAF9F9] via-[#F5F5F6] to-rose-50/30">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo & Title */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex size-9 items-center justify-center rounded-[8px] bg-[#881337] text-white font-bold text-base tracking-wider shadow-sm transition-transform group-hover:scale-105">
              R
            </div>
            <div className="flex flex-col text-left">
              <span className="font-semibold text-base tracking-tight text-[#1C1917] leading-none">
                RAFA Company
              </span>
              <span className="text-[11px] text-[#78716C] mt-1 font-mono">
                AI Autonomous Developer Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Login Card */}
        <Card className="border-[#E7E5E4] shadow-sm bg-white rounded-[10px]">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold tracking-tight text-[#1C1917]">
                Masuk ke Workspace
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-mono border-rose-200 text-[#881337] bg-rose-50/50">
                v1.0 Cloud
              </Badge>
            </div>
            <CardDescription className="text-xs text-[#78716C]">
              Masukkan akun Anda untuk mengelola AI agents, bug fixing pipelines, dan client orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1C1917] block">Email</label>
                <div className="relative">
                  <Mail className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@company.com"
                    className="pl-9 h-10 text-xs rounded-[6px] bg-[#FAF9F9] border-[#E7E5E4]"
                    required
                    autoFocus
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#1C1917] block">Password</label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info("Gunakan akun default: admin@rafa.ai / admin123");
                    }}
                    className="text-[11px] text-[#881337] hover:underline"
                  >
                    Lupa password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A8A29E]" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 pr-9 h-10 text-xs rounded-[6px] bg-[#FAF9F9] border-[#E7E5E4]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#1C1917]"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                disabled={isLoading}
                className="w-full h-10 text-xs font-semibold rounded-[6px] mt-2 bg-[#881337] hover:bg-[#6b0f2b]"
              >
                {isLoading ? "Memvalidasi..." : "Masuk ke Dashboard"}
                <ArrowRight className="size-3.5 ml-1.5" />
              </Button>
            </form>

            {/* Quick Demo Credentials Tip */}
            <div className="mt-5 p-3 rounded-[6px] bg-rose-50/70 border border-[#FECDD3] text-[11px] text-[#881337] space-y-1">
              <span className="font-semibold flex items-center gap-1.5">
                <ShieldCheck className="size-3.5" /> Akun Superadmin Default:
              </span>
              <p className="font-mono text-[10px] text-[#57534E]">
                Email: <span className="text-[#1C1917] font-semibold">admin@rafa.ai</span> • Pass: <span className="text-[#1C1917] font-semibold">admin123</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Security Note */}
        <p className="text-center text-[11px] text-[#A8A29E] flex items-center justify-center gap-1">
          <Terminal className="size-3" /> Dilindungi oleh Cloudflare Workers Edge & Zero-Retention Security
        </p>
      </div>
    </div>
  );
}
