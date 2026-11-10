"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token && !isAuthPage) {
      setIsAuthenticated(false);
      router.replace("/login");
    } else if (token && isAuthPage) {
      setIsAuthenticated(true);
      router.replace("/");
    } else {
      setIsAuthenticated(!!token);
    }
  }, [pathname, isAuthPage, router]);

  // Halaman autentikasi langsung render children
  if (isAuthPage) {
    return <main className="min-h-screen w-full bg-[#F5F5F6]">{children}</main>;
  }

  // Jika belum terautentikasi dan bukan halaman login, tampilkan loading/splash shimmer sejenak sebelum redirect
  if (isAuthenticated === null || !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F5F5F6]">
        <div className="flex flex-col items-center gap-3">
          <div className="size-9 rounded-lg bg-[#881337] flex items-center justify-center text-white font-bold text-base shadow-sm animate-pulse">
            R
          </div>
          <span className="text-xs text-[#78716C] font-mono animate-pulse">
            Memeriksa sesi pengguna...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F6] text-[#1C1917]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
