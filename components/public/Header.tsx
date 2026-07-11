"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/programs", label: "البرامج" },
  { href: "/coaches", label: "المدربون" },
  { href: "/gallery", label: "المعرض" },
  { href: "/news", label: "الأخبار" },
  { href: "/contact", label: "اتصل بنا" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-dark/95 backdrop-blur-md shadow-lg shadow-black/20" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.webp" alt="أكاديمية هولندا" width={70} height={70} className="rounded-full" />
            <span className="text-white font-bold text-xl hidden sm:block">Holanda Academy</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + Mobile */}
          <div className="flex items-center gap-3">
            <Link href="/registration" className="hidden sm:inline-flex btn-primary text-sm py-2">
              سجّل الآن
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden text-white p-2"
              aria-label="القائمة"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden bg-dark-100 border border-dark-300 rounded-xl mb-4 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/registration" onClick={() => setOpen(false)} className="btn-primary w-full justify-center mt-2 text-sm">
              سجّل الآن
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
