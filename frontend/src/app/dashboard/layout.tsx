"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  House,
  PenSquare,
  History,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: House,
    },
    {
      label: "Reflect",
      href: "/dashboard/new-reflection",
      icon: PenSquare,
    },
    {
      label: "History",
      href: "/dashboard/history",
      icon: History,
    },
    {
  label: "Timeline",
  href: "/dashboard/timeline",
  icon: History,
},
    {
      label: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      label: "Reports",
      href: "/dashboard/reports",
      icon: FileText,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <main className="breathing-bg min-h-screen">
      {/* Desktop Sidebar */}

      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-[#c8d6df]/10 bg-[#05070d]/80 p-6 backdrop-blur md:block">
        <Link href="/dashboard" className="text-2xl text-[#d8b56d]">
          Self Reflection AI
        </Link>

        <nav className="mt-12 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${
                  pathname === item.href
                    ? "bg-[#d8b56d]/10 text-[#d8b56d]"
                    : "text-[#a9b4c2] hover:bg-[#d8b56d]/10 hover:text-[#d8b56d]"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="absolute bottom-8 left-6 rounded-full border border-[#c8d6df]/10 px-6 py-3 text-[#8d98a7] hover:border-[#d8b56d]/40 hover:text-[#d8b56d]"
        >
          Sign out
        </button>
      </aside>

     
      <header className="sticky top-0 z-40 border-b border-[#c8d6df]/10 bg-[#05070d]/80 px-5 py-4 backdrop-blur md:hidden">
        <h1 className="text-lg text-[#d8b56d]">
          Self Reflection AI
        </h1>
      </header>

      {/* Page Content */}

      <section className="min-h-screen px-5 py-8 pb-28 md:ml-72 md:px-10">
        {children}
      </section>

      {/* Mobile Bottom Navigation */}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#c8d6df]/10 bg-[#05070d]/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-around py-3">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 text-xs ${
                  active
                    ? "text-[#d8b56d]"
                    : "text-[#8d98a7]"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}