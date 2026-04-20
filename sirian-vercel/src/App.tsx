import { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import ParticleBackground from "@/components/ParticleBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import BooksSection from "@/components/BooksSection";
import PodcastSection from "@/components/PodcastSection";
import ArticlesSection from "@/components/ArticlesSection";
import AdminPanel from "@/pages/AdminPanel";
import AdminLogin from "@/components/AdminLogin";
import { Language } from "@/lib/i18n";
import { isAuthenticated, logout } from "@/lib/adminAuth";
import { getSiteContent } from "@/lib/supabase";

function scrollTo(id: string) {
  if (id === "hero") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function MainApp() {
  const [lang, setLang] = useState<Language>("en");
  const [whatsapp, setWhatsapp] = useState("+213551554758");
  const [contactTitle, setContactTitle] = useState("Have a Project?");
  const [contactDesc, setContactDesc] = useState("I'm available for new projects. Reach out and let's build something extraordinary together.");
  const toggleLang = () => setLang((l) => (l === "en" ? "ar" : "en"));

  useEffect(() => {
    getSiteContent().then((c) => {
      if (c["whatsapp_number"]) setWhatsapp(c["whatsapp_number"]);
      if (c["contact_title"]) setContactTitle(c["contact_title"]);
      if (c["contact_desc"]) setContactDesc(c["contact_desc"]);
    });
  }, []);

  const isAr = lang === "ar";

  return (
    <div className="relative min-h-screen bg-black" dir={isAr ? "rtl" : "ltr"}>
      <ParticleBackground />
      <Navbar lang={lang} onToggleLang={toggleLang} onNav={scrollTo} />

      <HeroSection lang={lang} onNav={scrollTo} />
      <AboutSection lang={lang} />
      <ServicesSection lang={lang} />
      <BooksSection lang={lang} />
      <PodcastSection lang={lang} />
      <ArticlesSection lang={lang} />

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-24 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center" dir={isAr ? "rtl" : "ltr"}>
          <span className="text-sm font-semibold tracking-widest uppercase block mb-3" style={{ color: "#f97316", fontFamily: "'Poppins', sans-serif" }}>
            {isAr ? "دعنا نعمل معاً" : "Let's Work Together"}
          </span>
          <h2 className="font-black text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(32px, 4vw, 52px)" }}>
            {isAr ? (contactTitle || "هل لديك مشروع؟") : contactTitle}
          </h2>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "15px", lineHeight: "1.8" }}>
            {isAr ? (contactDesc || "أنا متاح للعمل على مشاريع جديدة.") : contactDesc}
          </p>
          <a
            href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-3"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {isAr ? "تواصل عبر واتساب" : "WhatsApp Me"}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <p className="text-gray-700 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {isAr ? "© 2026 آدم — جميع الحقوق محفوظة" : "© 2026 Adem — All Rights Reserved"}
        </p>
      </footer>
    </div>
  );
}

function AdminWrapper() {
  const [lang, setLang] = useState<Language>("en");
  const [authed, setAuthed] = useState(isAuthenticated());

  const handleLogout = () => {
    logout();
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  return (
    <div style={{ background: "#000000", minHeight: "100vh" }}>
      {/* Admin top bar */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(249,115,22,0.1)" }}
      >
        <div className="flex items-center gap-4">
          <a href="/" className="text-lg font-black text-white hover:text-orange-400 transition-colors duration-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Adam<span style={{ color: "#f97316" }}>.</span>
          </a>
          <span className="text-xs text-gray-700 font-medium tracking-widest uppercase hidden md:block" style={{ fontFamily: "'Poppins', sans-serif" }}>Admin Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-xs font-medium text-gray-500 hover:text-white transition-colors px-3 py-1.5 rounded-full"
            style={{ fontFamily: "'Poppins', sans-serif", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            View Site
          </a>
          <button
            onClick={() => setLang((l) => (l === "en" ? "ar" : "en"))}
            className="text-xs font-medium text-gray-400 hover:text-orange-400 transition-colors border border-gray-800 hover:border-orange-700 px-3 py-1.5 rounded-full"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {lang === "en" ? "العربية" : "EN"}
          </button>
        </div>
      </div>
      <AdminPanel lang={lang} onLogout={handleLogout} />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/sirian-admin" component={AdminWrapper} />
      <Route path="/sirian-admin/*" component={AdminWrapper} />
      <Route component={MainApp} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
      <Router />
    </WouterRouter>
  );
}

export default App;
