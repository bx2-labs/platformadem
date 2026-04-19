import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, Article } from "@/lib/supabase";
import { Language } from "@/lib/i18n";

interface ArticlesSectionProps {
  lang: Language;
}

export default function ArticlesSection({ lang }: ArticlesSectionProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Article | null>(null);
  const isAr = lang === "ar";

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
      if (data) setArticles(data);
      setLoading(false);
    };
    fetch();
    const ch = supabase.channel("articles-ch").on("postgres_changes", { event: "*", schema: "public", table: "articles" }, fetch).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  return (
    <section id="articles" className="relative z-10 py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase block mb-3" style={{ color: "#f97316", fontFamily: "'Poppins', sans-serif" }}>
            {isAr ? "أكتب" : "I Write"}
          </span>
          <h2 className="font-black text-white" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(32px, 4vw, 52px)" }}>
            {isAr ? "المقالات" : "Articles"}
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex items-center gap-3"><div className="w-5 h-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" /></div>
        ) : articles.length === 0 ? (
          <div className="card-dark p-12 text-center"><p className="text-gray-600 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{isAr ? "لا توجد مقالات بعد." : "No articles yet."}</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
            {articles.map((article, i) => (
              <motion.button
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(article)}
                className="card-dark text-left group overflow-hidden"
                style={{ textAlign: isAr ? "right" : "left" }}
              >
                {/* Featured image */}
                {article.featured_image && (
                  <div className="w-full h-40 overflow-hidden">
                    <img
                      src={article.featured_image}
                      alt={article.article_title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-white font-semibold text-sm group-hover:text-orange-400 transition-colors duration-300" style={{ fontFamily: "'Poppins', sans-serif", lineHeight: "1.6" }}>
                      {article.article_title}
                    </h3>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-orange-500/20" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#f97316" strokeWidth="2">
                        {isAr ? <polyline points="15,18 9,12 15,6"/> : <polyline points="9,18 15,12 9,6"/>}
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs mt-3 line-clamp-2 text-left" style={{ fontFamily: "'Poppins', sans-serif", lineHeight: "1.7", textAlign: isAr ? "right" : "left" }}>
                    {article.full_content?.substring(0, 120)}...
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
          >
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(20px)" }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-[20px]"
              style={{ background: "#0d0d0d", border: "1px solid rgba(249,115,22,0.2)", boxShadow: "0 0 60px rgba(249,115,22,0.12)" }}
              dir={isAr ? "rtl" : "ltr"}
            >
              {selected.featured_image && (
                <div className="w-full h-52 overflow-hidden rounded-t-[20px]">
                  <img src={selected.featured_image} alt={selected.article_title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-8 md:p-10">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-5 flex items-center justify-center transition-colors"
                  style={{
                    right: isAr ? "auto" : "1.25rem",
                    left: isAr ? "1.25rem" : "auto",
                    top: selected.featured_image ? "14rem" : "1.25rem",
                    width: 32, height: 32, borderRadius: "50%",
                    background: "rgba(0,0,0,0.7)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#aaa",
                    cursor: "pointer",
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>{selected.article_title}</h3>
                <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap" style={{ fontFamily: "'Poppins', sans-serif", lineHeight: "1.9" }}>
                  {selected.full_content}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
