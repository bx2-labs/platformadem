import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, Book } from "@/lib/supabase";
import { Language } from "@/lib/i18n";

interface BooksSectionProps {
  lang: Language;
}

export default function BooksSection({ lang }: BooksSectionProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const isAr = lang === "ar";

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("books").select("*").order("created_at", { ascending: false });
      if (data) setBooks(data);
      setLoading(false);
    };
    fetch();
    const ch = supabase.channel("books-ch").on("postgres_changes", { event: "*", schema: "public", table: "books" }, fetch).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const active = books[activeIndex];

  return (
    <section id="books" className="relative z-10 py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto" dir={isAr ? "rtl" : "ltr"}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <span className="text-sm font-semibold tracking-widest uppercase block mb-3" style={{ color: "#f97316", fontFamily: "'Poppins', sans-serif" }}>
            {isAr ? "المكتبة" : "Reading List"}
          </span>
          <h2 className="font-black text-white" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(32px, 4vw, 52px)" }}>
            {isAr ? "الكتب" : "Books"}
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
            <span className="text-gray-600 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{isAr ? "جاري التحميل..." : "Loading..."}</span>
          </div>
        ) : books.length === 0 ? (
          <div className="card-dark p-12 text-center">
            <p className="text-gray-600 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>{isAr ? "لا توجد كتب بعد." : "No books yet. Add some from the admin panel."}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Book list */}
            <div className="flex flex-col gap-3">
              {books.map((book, i) => (
                <motion.button
                  key={book.id}
                  initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setActiveIndex(i)}
                  className="text-left p-4 rounded-[12px] transition-all duration-300"
                  style={{
                    background: activeIndex === i ? "rgba(249,115,22,0.1)" : "#111111",
                    border: activeIndex === i ? "1px solid rgba(249,115,22,0.4)" : "1px solid rgba(255,255,255,0.04)",
                    textAlign: isAr ? "right" : "left",
                    boxShadow: activeIndex === i ? "0 0 20px rgba(249,115,22,0.15)" : "none",
                  }}
                >
                  <p className="text-sm font-semibold" style={{ color: activeIndex === i ? "#f97316" : "#d0d0d0", fontFamily: "'Poppins', sans-serif" }}>
                    {book.title}
                  </p>
                </motion.button>
              ))}
            </div>

            {/* Active book */}
            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="md:col-span-2 card-dark p-8 flex gap-8"
                >
                  <div className="w-32 flex-shrink-0 rounded-[12px] overflow-hidden" style={{ border: "1px solid rgba(249,115,22,0.2)", height: "180px" }}>
                    <img src={active.cover_image_url} alt={active.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }} />
                  </div>
                  <div className="flex flex-col gap-4 flex-1">
                    <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>{active.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif", lineHeight: "1.8" }}>{active.description}</p>
                    <a
                      href={`https://wa.me/${active.whatsapp_number?.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary mt-auto w-fit flex items-center gap-2"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      {isAr ? "اطلب عبر واتساب" : "Order via WhatsApp"}
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
