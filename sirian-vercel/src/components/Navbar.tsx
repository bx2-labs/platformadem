import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Language, t } from "@/lib/i18n";

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  onNav: (id: string) => void;
}

export default function Navbar({ lang, onToggleLang, onNav }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { id: "hero", label: lang === "ar" ? "الرئيسية" : "Home" },
    { id: "about", label: lang === "ar" ? "عني" : "About" },
    { id: "services", label: lang === "ar" ? "الخدمات" : "Services" },
    { id: "books", label: lang === "ar" ? "الكتب" : "Books" },
    { id: "podcasts", label: lang === "ar" ? "البودكاست" : "Podcast" },
    { id: "articles", label: lang === "ar" ? "المقالات" : "Articles" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.3)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: scrolled ? "1px solid rgba(249,115,22,0.12)" : "1px solid transparent",
        transition: "all 0.4s ease",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between" dir={lang === "ar" ? "rtl" : "ltr"}>
        <button
          onClick={() => onNav("hero")}
          className="text-xl font-bold text-white hover:text-orange-400 transition-colors duration-300"
          style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "0.02em" }}
        >
          Adem<span style={{ color: "#f97316" }}>.</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link.id}
              onClick={() => onNav(link.id)}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 relative group"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-0 w-0 h-px bg-orange-500 group-hover:w-full transition-all duration-300"
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLang}
            className="text-xs font-medium text-gray-400 hover:text-orange-400 transition-colors duration-300 border border-gray-700 hover:border-orange-600 px-3 py-1.5 rounded-full"
          >
            {lang === "en" ? "العربية" : "EN"}
          </button>
          <button
            onClick={() => onNav("contact")}
            className="btn-primary text-sm py-2 px-5"
            style={{ borderRadius: "8px", fontSize: "13px", fontFamily: "'Poppins', sans-serif" }}
          >
            {lang === "ar" ? "تواصل معي" : "Hire Me"}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
