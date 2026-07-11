export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { getSettings } from "@/lib/api";

export const metadata: Metadata = { title: "اتصل بنا" };

export default async function ContactPage() {
  const settings = await getSettings();

  const contactItems = [
    settings.whatsapp && { icon: "📱", label: "واتساب", value: settings.whatsapp, href: `https://wa.me/${settings.whatsapp}` },
    settings.email && { icon: "📧", label: "البريد الإلكتروني", value: settings.email, href: `mailto:${settings.email}` },
    settings.address && { icon: "📍", label: "العنوان", value: settings.address, href: null },
  ].filter(Boolean) as { icon: string; label: string; value: string; href: string | null }[];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">تواصل</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-3 mb-4">اتصل بنا</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">نحن هنا للإجابة عن جميع استفساراتك</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h2 className="text-white font-bold text-2xl mb-6">معلومات التواصل</h2>
            <div className="space-y-4">
              {contactItems.map((item) => (
                <div key={item.label} className="card p-5 flex items-center gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-primary transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-white font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
              {(settings.instagram || settings.facebook || settings.twitter || settings.youtube) && (
                <div className="card p-5">
                  <p className="text-gray-400 text-xs mb-3">تابعنا على</p>
                  <div className="flex gap-4">
                    {settings.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary text-2xl transition-colors">📸</a>}
                    {settings.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary text-2xl transition-colors">👥</a>}
                    {settings.twitter && <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary text-2xl transition-colors">🐦</a>}
                    {settings.youtube && <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary text-2xl transition-colors">▶️</a>}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-white font-bold text-2xl mb-6">موقعنا</h2>
            {settings.google_map_url ? (
              <div className="rounded-2xl overflow-hidden h-80">
                <iframe src={settings.google_map_url} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            ) : (
              <div className="card h-80 flex items-center justify-center text-gray-500">
                <div className="text-center"><div className="text-5xl mb-4">📍</div><p>لم يتم إضافة الخريطة بعد</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
