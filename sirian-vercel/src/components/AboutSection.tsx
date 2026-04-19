import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Language } from "@/lib/i18n";
import { getSiteContent, ContentMap } from "@/lib/supabase";

interface AboutSectionProps {
  lang: Language;
}

export default function AboutSection({ lang }: AboutSectionProps) {
  const isAr = lang === "ar";
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    getSiteContent().then(setContent);
  }, []);

  const bio = content["about_bio"] || (isAr
    ? "أنا مطور ويب شغوف ومتخصص في الأمن السيبراني. أؤمن بأن التكنولوجيا يجب أن تكون جميلة وآمنة ومؤثرة."
    : "I'm a passionate web developer and cybersecurity specialist who believes technology should be beautiful, secure, and impactful.");
  const name = content["about_name"] || "Adem";
  const location = content["about_location"] || (isAr ? "الجزائر" : "Algeria");
  const email = content["about_email"] || "hello@adam.dev";
  const status = content["about_status"] || (isAr ? "متاح" : "Available");
  const statYears = content["stat_years"] || "+1";
  const statProjects = content["stat_projects"] || "10+";

  const skills = [
    { name: content["skill_1_name"] || "React / Next.js", level: parseInt(content["skill_1_level"] || "90") },
    { name: content["skill_2_name"] || "Node.js / Express", level: parseInt(content["skill_2_level"] || "85") },
    { name: content["skill_3_name"] || "Cybersecurity", level: parseInt(content["skill_3_level"] || "80") },
    { name: content["skill_4_name"] || "UI/UX Design", level: parseInt(content["skill_4_level"] || "75") },
  ];

  return (
    <section id="about" className="relative z-10 py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <span
            className="text-sm font-semibold tracking-widest uppercase block mb-3"
            style={{ color: "#f97316", fontFamily: "'Poppins', sans-serif" }}
          >
            {isAr ? "من أنا" : "About Me"}
          </span>
          <h2
            className="font-black text-white"
            style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(32px, 4vw, 52px)" }}
          >
            {isAr ? "الشخص وراء الكود" : "The Person Behind the Code"}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex flex-col gap-6"
          >
            <div
              className="p-8 rounded-[20px]"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p
                className="text-gray-400 leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif", fontSize: "15px", lineHeight: "1.9" }}
              >
                {bio}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { label: isAr ? "الاسم" : "Name", value: name },
                  { label: isAr ? "الموقع" : "Location", value: location },
                  { label: isAr ? "البريد" : "Email", value: email },
                  { label: isAr ? "الحالة" : "Status", value: status },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-xs text-gray-600 font-medium mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.label}</p>
                    <p className="text-sm text-white font-semibold" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience badges */}
            <div className="flex gap-4">
              <div
                className="flex items-center gap-4 px-6 py-5 rounded-[20px]"
                style={{
                  background: "#f97316",
                  boxShadow: "0 0 40px rgba(249,115,22,0.4)",
                }}
              >
                <span className="font-black text-4xl text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{statYears}</span>
                <div>
                  <p className="text-white font-bold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{isAr ? "سنوات" : "Years of"}</p>
                  <p className="text-white/80 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>{isAr ? "من الخبرة" : "Experience"}</p>
                </div>
              </div>

              <div
                className="flex items-center gap-4 px-6 py-5 rounded-[20px] flex-1"
                style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span className="font-black text-4xl" style={{ color: "#f97316", fontFamily: "'Poppins', sans-serif" }}>{statProjects}</span>
                <div>
                  <p className="text-white font-bold text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{isAr ? "مشاريع" : "Projects"}</p>
                  <p className="text-gray-500 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>{isAr ? "منجزة" : "Completed"}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — skills */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            <h3
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {isAr ? "مهاراتي التقنية" : "Technical Skills"}
            </h3>

            <div className="flex flex-col gap-5">
              {skills.map((skill, i) => (
                <motion.div
                  key={skill.name + i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300" style={{ fontFamily: "'Poppins', sans-serif" }}>{skill.name}</span>
                    <span className="text-sm font-bold" style={{ color: "#f97316", fontFamily: "'Poppins', sans-serif" }}>{skill.level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "#1a1a1a" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: i * 0.1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #f97316, #f59e0b)" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <div
              className="p-6 rounded-[20px] mt-4"
              style={{ background: "#111111", border: "1px solid rgba(249,115,22,0.15)" }}
            >
              <p
                className="text-gray-400 text-sm leading-relaxed"
                style={{ fontFamily: "'Poppins', sans-serif", lineHeight: "1.8" }}
              >
                {isAr
                  ? "متخصص في بناء تطبيقات ويب متكاملة مع التركيز على الأمان وتجربة المستخدم."
                  : "Specialized in building full-stack web applications with a focus on security and user experience. I believe in continuous learning."}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
