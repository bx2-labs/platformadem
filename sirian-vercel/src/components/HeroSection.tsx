import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Language } from "@/lib/i18n";
import { getSiteContent, ContentMap } from "@/lib/supabase";

interface HeroSectionProps {
  lang: Language;
  onNav: (id: string) => void;
}

export default function HeroSection({ lang, onNav }: HeroSectionProps) {
  const isAr = lang === "ar";
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    getSiteContent().then(setContent);
  }, []);

  const greeting = content["hero_greeting"] || (isAr ? "مرحباً، أنا" : "Hi, I'm");
  const name = content["hero_name"] || "Adem";
  const subtitle = content["hero_subtitle"] || (isAr ? "مطور ويب ومتحمس للأمن السيبراني" : "Web Developer & Cybersecurity Enthusiast");
  const description = content["hero_description"] || (isAr ? "أبني تجارب رقمية تجمع بين الجمال والأداء والأمان." : "I craft digital experiences where beauty meets performance and security.");
  const profileImg = content["profile_image_url"];
  const statYears = content["stat_years"] || "+1";
  const statProjects = content["stat_projects"] || "10+";
  const statSatisfaction = content["stat_satisfaction"] || "100%";

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center z-10 pt-24 pb-16 px-6 md:px-10"
    >
      <div
        className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-14"
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Left — Typography */}
        <div className="flex-1 flex flex-col gap-6 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "#f97316", fontFamily: "'Poppins', sans-serif", letterSpacing: "0.2em" }}
            >
              {isAr ? "مرحباً بك" : "Welcome"}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-black text-white leading-tight"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(42px, 6vw, 78px)",
              lineHeight: 1.05,
            }}
          >
            {greeting} <span style={{ color: "#f97316" }}>{name}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-gray-400 font-medium"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "clamp(16px, 2.2vw, 22px)",
            }}
          >
            {subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="text-gray-500 text-sm leading-relaxed max-w-md"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-4 pt-2"
          >
            <button onClick={() => onNav("services")} className="btn-primary">
              {isAr ? "استكشف عملي" : "My Services"}
            </button>
            <button onClick={() => onNav("about")} className="btn-secondary">
              {isAr ? "عني" : "About Me"}
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex items-center gap-8 pt-4"
          >
            {[
              { num: statYears, label: isAr ? "سنوات خبرة" : "Years Exp." },
              { num: statProjects, label: isAr ? "مشروع" : "Projects" },
              { num: statSatisfaction, label: isAr ? "رضا العملاء" : "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span
                  className="font-black text-2xl"
                  style={{ color: "#f97316", fontFamily: "'Poppins', sans-serif" }}
                >
                  {stat.num}
                </span>
                <span
                  className="text-xs text-gray-500 font-medium"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Profile image blob (التعديل الجديد هنا) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex-shrink-0 flex items-center justify-center relative"
        >
          {/* Outer glow ring - حجم أكبر للتوازن */}
          <div
            className="absolute rounded-full"
            style={{
              width: 450,
              height: 450,
              background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
              filter: "blur(25px)",
            }}
          />

          <div className="relative flex items-center justify-center" style={{ width: 400, height: 400 }}>
            <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#ea580c" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <path
                d="M150,30 C200,20 270,60 280,120 C290,180 250,250 190,270 C130,290 60,260 40,200 C20,140 50,70 100,45 C120,36 130,32 150,30 Z"
                fill="url(#blobGrad)"
                opacity="0.85"
              />
            </svg>

            {/* Profile image - الإطار مكبر لـ 300 بيكسل لإبراز ملامح الوجه */}
            <div
              className="relative z-10 flex items-center justify-center overflow-hidden"
              style={{
                width: 300,
                height: 300,
                clipPath: "path('M150,30 C200,20 270,60 280,120 C290,180 250,250 190,270 C130,290 60,260 40,200 C20,140 50,70 100,45 C120,36 130,32 150,30 Z')",
              }}
            >
              {profileImg ? (
                <img
                  src={profileImg}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }}>
                   <svg viewBox="0 0 80 80" width="90" height="90" fill="none">
                    <circle cx="40" cy="28" r="18" fill="rgba(249,115,22,0.5)" />
                    <path d="M10 75 C10 55 70 55 70 75" fill="rgba(249,115,22,0.4)" />
                  </svg>
                </div>
              )}
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-2 -right-2 px-5 py-4 rounded-xl"
              style={{
                background: "#f97316",
                boxShadow: "0 0 30px rgba(249,115,22,0.6)",
                zIndex: 10,
              }}
            >
              <p className="text-white font-black text-xl leading-none" style={{ fontFamily: "'Poppins', sans-serif" }}>{statYears}</p>
              <p className="text-white/80 text-xs font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>{isAr ? "سنوات" : "Years Exp."}</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1"
          style={{ borderColor: "rgba(249,115,22,0.4)" }}
        >
          <div className="w-1 h-2 rounded-full" style={{ background: "#f97316" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
