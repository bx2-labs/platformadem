import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, Podcast } from "@/lib/supabase";
import { Language } from "@/lib/i18n";

interface PodcastSectionProps {
  lang: Language;
}

export default function PodcastSection({ lang }: PodcastSectionProps) {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [duration, setDuration] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const isAr = lang === "ar";

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("podcasts").select("*").order("created_at", { ascending: false });
      if (data) setPodcasts(data);
      setLoading(false);
    };
    fetch();
    const ch = supabase.channel("podcasts-ch").on("postgres_changes", { event: "*", schema: "public", table: "podcasts" }, fetch).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const togglePlay = (id: string, url: string) => {
    if (playing === id) { audioRefs.current[id]?.pause(); setPlaying(null); return; }
    if (playing && audioRefs.current[playing]) audioRefs.current[playing].pause();
    if (!audioRefs.current[id]) {
      const audio = new Audio(url);
      audio.addEventListener("timeupdate", () => setProgress((p) => ({ ...p, [id]: audio.currentTime })));
      audio.addEventListener("loadedmetadata", () => setDuration((d) => ({ ...d, [id]: audio.duration })));
      audio.addEventListener("ended", () => setPlaying(null));
      audioRefs.current[id] = audio;
    }
    audioRefs.current[id].play();
    setPlaying(id);
  };

  const seek = (id: string, value: number) => {
    if (audioRefs.current[id]) { audioRefs.current[id].currentTime = value; setProgress((p) => ({ ...p, [id]: value })); }
  };

  const fmt = (s: number) => { if (isNaN(s)) return "0:00"; return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`; };

  return (
    <section id="podcasts" className="relative z-10 py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase block mb-3" style={{ color: "#f97316", fontFamily: "'Poppins', sans-serif" }}>
            {isAr ? "استمع" : "Listen"}
          </span>
          <h2 className="font-black text-white" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(32px, 4vw, 52px)" }}>
            {isAr ? "البودكاست" : "Podcast"}
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex items-center gap-3"><div className="w-5 h-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" /><span className="text-gray-600 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{isAr ? "جاري التحميل..." : "Loading..."}</span></div>
        ) : podcasts.length === 0 ? (
          <div className="card-dark p-12 text-center"><p className="text-gray-600 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{isAr ? "لا توجد حلقات بعد." : "No episodes yet."}</p></div>
        ) : (
          <div className="flex flex-col gap-4 max-w-3xl">
            {podcasts.map((ep, i) => (
              <motion.div
                key={ep.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-[20px] overflow-hidden"
                style={{
                  background: "#111111",
                  border: playing === ep.id ? "1px solid rgba(249,115,22,0.35)" : "1px solid rgba(255,255,255,0.05)",
                  boxShadow: playing === ep.id ? "0 0 30px rgba(249,115,22,0.15)" : "none",
                  transition: "all 0.3s ease",
                }}
              >
                <div className="flex items-center gap-5 p-5">
                  <div className="w-14 h-14 flex-shrink-0 rounded-[12px] overflow-hidden" style={{ border: "1px solid rgba(249,115,22,0.2)" }}>
                    <img src={ep.cover_image} alt={ep.episode_title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect width='56' height='56' fill='%23111'/%3E%3C/svg%3E"; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{ep.episode_title}</p>
                    <p className="text-gray-600 text-xs truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{ep.description}</p>
                  </div>
                  <button
                    onClick={() => togglePlay(ep.id, ep.audio_file_url)}
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      background: playing === ep.id ? "#f97316" : "rgba(249,115,22,0.1)",
                      border: "1px solid rgba(249,115,22,0.4)",
                      boxShadow: playing === ep.id ? "0 0 20px rgba(249,115,22,0.5)" : "none",
                    }}
                  >
                    {playing === ep.id
                      ? <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                      : <svg viewBox="0 0 24 24" width="14" height="14" fill={playing === ep.id ? "white" : "#f97316"}><polygon points="5,3 19,12 5,21"/></svg>
                    }
                  </button>
                </div>

                <AnimatePresence>
                  {playing === ep.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-10 text-right" style={{ fontFamily: "'Poppins', sans-serif" }}>{fmt(progress[ep.id] ?? 0)}</span>
                        <div className="flex-1 relative h-1 rounded-full bg-gray-800 cursor-pointer" onClick={(e) => {
                          const rect = (e.target as HTMLElement).getBoundingClientRect();
                          seek(ep.id, ((e.clientX - rect.left) / rect.width) * (duration[ep.id] ?? 0));
                        }}>
                          <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${((progress[ep.id] ?? 0) / (duration[ep.id] || 1)) * 100}%`, background: "linear-gradient(90deg, #f97316, #f59e0b)", transition: "width 0.1s linear" }} />
                        </div>
                        <span className="text-xs text-gray-500 w-10" style={{ fontFamily: "'Poppins', sans-serif" }}>{fmt(duration[ep.id] ?? 0)}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
