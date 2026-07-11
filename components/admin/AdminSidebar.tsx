"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FolderOpen, Users, Image as ImageIcon, Newspaper, ClipboardList, Settings, LogOut } from "lucide-react";

const links = [
  { href: "/admin", icon: LayoutDashboard, label: "الرئيسية", exact: true },
  { href: "/admin/programs", icon: FolderOpen, label: "البرامج" },
  { href: "/admin/coaches", icon: Users, label: "المدربون" },
  { href: "/admin/gallery", icon: ImageIcon, label: "المعرض" },
  { href: "/admin/news", icon: Newspaper, label: "الأخبار" },
  { href: "/admin/registrations", icon: ClipboardList, label: "التسجيلات" },
  { href: "/admin/settings", icon: Settings, label: "الإعدادات" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-dark-100 border-l border-dark-300 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-dark-300">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/logo.webp" alt="أكاديمية هولندا" width={40} height={40} className="rounded-full" />
          <div>
            <p className="text-white font-bold text-sm">أكاديمية هولندا</p>
            <p className="text-gray-500 text-xs">لوحة التحكم</p>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} className={cn("flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors", active ? "bg-primary/10 text-primary border border-primary/20" : "text-gray-400 hover:text-white hover:bg-dark-200")}>
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-dark-300">
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors w-full">
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
