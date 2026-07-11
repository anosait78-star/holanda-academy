"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroVideo() {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/video1.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block bg-primary/20 border border-primary/50 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            🏆 أكاديمية هولندا لكرة القدم
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            نصنع{" "}
            <span className="text-primary">أبطال</span>
            <br />المستقبل
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            برامج تدريبية احترافية على أيدي أفضل المدربين، لبناء جيل من الأبطال الذين يتنافسون على أعلى المستويات
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registration" className="btn-primary text-base px-8 py-4">
              سجّل الآن مجاناً
            </Link>
            <Link href="/programs" className="btn-outline text-base px-8 py-4">
              استكشف البرامج
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
        <span className="text-xs">اسحب للأسفل</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-0.5 h-8 bg-gradient-to-b from-primary to-transparent rounded-full"
        />
      </div>
    </section>
  );
}
