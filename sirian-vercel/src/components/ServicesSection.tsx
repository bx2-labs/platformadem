import { motion } from "framer-motion";
import { Language } from "@/lib/i18n";

interface ServicesSectionProps {
  lang: Language;
}

const services = [
  {
    icon: (
      <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
        <rect x="4" y="8" width="32" height="22" rx="3" stroke="#f97316" strokeWidth="2"/>
        <path d="M13 30 L10 36 M27 30 L30 36 M10 36 L30 36" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
        <path d="M11 18 L16 23 L11 28" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 28 L29 28" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    en: { title: "Web Development", desc: "Full-stack web applications built with modern frameworks — fast, scalable, and pixel-perfect." },
    ar: { title: "تطوير الويب", desc: "تطبيقات ويب متكاملة مبنية بأحدث الأطر التقنية — سريعة وقابلة للتوسع." },
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
        <circle cx="20" cy="20" r="14" stroke="#f97316" strokeWidth="2"/>
        <path d="M20 12 L20 16 M20 24 L20 28 M12 20 L16 20 M24 20 L28 20" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="4" stroke="#f97316" strokeWidth="1.5"/>
      </svg>
    ),
    en: { title: "Cybersecurity", desc: "Penetration testing, security audits, and hardening strategies to protect your digital assets." },
    ar: { title: "الأمن السيبراني", desc: "اختبارات الاختراق والتدقيق الأمني واستراتيجيات الحماية لأصولك الرقمية." },
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
        <rect x="6" y="6" width="12" height="12" rx="2" stroke="#f97316" strokeWidth="2"/>
        <rect x="22" y="6" width="12" height="12" rx="2" stroke="#f97316" strokeWidth="2"/>
        <rect x="6" y="22" width="12" height="12" rx="2" stroke="#f97316" strokeWidth="2"/>
        <rect x="22" y="22" width="12" height="12" rx="2" stroke="#f97316" strokeWidth="2"/>
      </svg>
    ),
    en: { title: "UI/UX Design", desc: "Intuitive, elegant interfaces designed to captivate users and drive conversion through great experience." },
    ar: { title: "تصميم الواجهات", desc: "واجهات بديهية وأنيقة مصممة لإسحار المستخدمين وزيادة التحويلات." },
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
        <rect x="8" y="14" width="24" height="18" rx="3" stroke="#f97316" strokeWidth="2"/>
        <path d="M14 14 L14 10 C14 8 16 6 20 6 C24 6 26 8 26 10 L26 14" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="20" cy="23" r="3" stroke="#f97316" strokeWidth="1.5"/>
      </svg>
    ),
    en: { title: "API Development", desc: "Robust RESTful and GraphQL APIs built for reliability, security, and seamless third-party integration." },
    ar: { title: "تطوير API", desc: "واجهات برمجية قوية مبنية للموثوقية والأمان وتكامل سلس مع الأطراف الثالثة." },
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
        <path d="M8 32 L8 18 L14 18 L14 32" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 32 L17 12 L23 12 L23 32" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M26 32 L26 22 L32 22 L32 32" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 32 L35 32" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    en: { title: "Performance Optimization", desc: "Speed audits, Core Web Vitals improvements, and architecture refactors that make your app fly." },
    ar: { title: "تحسين الأداء", desc: "تدقيقات السرعة وتحسينات Web Vitals وإعادة هيكلة البنية لجعل تطبيقك يطير." },
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" width="36" height="36" fill="none">
        <path d="M20 8 L34 16 L34 24 L20 32 L6 24 L6 16 Z" stroke="#f97316" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M20 8 L20 32 M6 16 L34 16 M6 24 L34 24" stroke="#f97316" strokeWidth="1.5" opacity="0.5"/>
        <circle cx="20" cy="20" r="3" fill="#f97316"/>
      </svg>
    ),
    en: { title: "My creativity has crossed its red lines", desc: "I write deep psychological novels and creative content that delves into complex human emotions, such as my current project Kineopsia" },
    ar: { title: "ابداعي تخطى حدوده الحمراء", desc:" أكتب روايات نفسية عميقة ومحتوى إبداعي يغوص في المشاعر الإنسانية المعقدة، مثل مشروعي الحالي كينوبسيا" },
  },
];

export default function ServicesSection({ lang }: ServicesSectionProps) {
  const isAr = lang === "ar";

  return (
    <section id="services" className="relative z-10 py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <span
            className="text-sm font-semibold tracking-widest uppercase block mb-3"
            style={{ color: "#f97316", fontFamily: "'Poppins', sans-serif" }}
          >
            {isAr ? "ماذا أقدم" : "What I Offer"}
          </span>
          <h2
            className="font-black text-white"
            style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(32px, 4vw, 52px)" }}
          >
            {isAr ? "خدماتي" : "My Services"}
          </h2>
          <p
            className="text-gray-500 mt-4 max-w-xl mx-auto text-sm"
            style={{ fontFamily: "'Poppins', sans-serif", lineHeight: "1.8" }}
          >
            {isAr
              ? "أقدم مجموعة متكاملة من الخدمات التقنية لمساعدتك في بناء حضورك الرقمي."
              : "A complete suite of technical services to help you build and secure your digital presence."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-dark p-8 cursor-default"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.15)" }}
              >
                {svc.icon}
              </div>
              <h3
                className="text-lg font-bold text-white mb-3"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {isAr ? svc.ar.title : svc.en.title}
              </h3>
              <p
                className="text-gray-500 text-sm leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif", lineHeight: "1.8" }}
              >
                {isAr ? svc.ar.desc : svc.en.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
