import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/api";

export default async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="bg-dark-100 border-t border-dark-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4">
              <Image src={settings.logo || "/logo.webp"} alt="أكاديمية هولندا" width={70} height={70} className="rounded-full" />
              <span className="text-white font-bold text-xl">{settings.academy_name || "أكاديمية هولندا"}</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {settings.footer_text || "نصنع أبطال المستقبل من خلال برامج تدريبية احترافية."}
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {[
                { href: "/programs", label: "البرامج" },
                { href: "/coaches", label: "المدربون" },
                { href: "/gallery", label: "المعرض" },
                { href: "/news", label: "الأخبار" },
                { href: "/registration", label: "التسجيل" },
                { href: "/contact", label: "اتصل بنا" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-primary text-sm transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">تواصل معنا</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {settings.whatsapp && (
                <li><a href={`https://wa.me/${settings.whatsapp}`} className="hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">📱 واتساب: {settings.whatsapp}</a></li>
              )}
              {settings.email && (
                <li><a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">📧 {settings.email}</a></li>
              )}
              {settings.address && <li>📍 {settings.address}</li>}
            </ul>
            <div className="flex gap-3 mt-4">
              {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary text-xl transition-colors">📸</a>}
              {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary text-xl transition-colors">👥</a>}
              {settings.twitter && <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary text-xl transition-colors">🐦</a>}
              {settings.youtube && <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary text-xl transition-colors">▶️</a>}
            </div>
          </div>
        </div>
        <div className="border-t border-dark-300 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} {settings.academy_name || "أكاديمية هولندا"}. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}
