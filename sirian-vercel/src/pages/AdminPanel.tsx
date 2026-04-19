import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  supabase,
  Book,
  Podcast,
  Article,
  ContentMap,
  getSiteContent,
  setSiteContent,
  uploadFile,
} from "@/lib/supabase";
import { logout } from "@/lib/adminAuth";
import { Language } from "@/lib/i18n";

type Tab = "profile" | "about" | "books" | "podcasts" | "articles";

interface AdminPanelProps {
  lang: Language;
  onLogout: () => void;
}

// ─── Styled primitives ──────────────────────────────────────────────────────
const inp =
  "w-full px-4 py-3 rounded-xl text-gray-200 text-sm outline-none transition-all duration-200 placeholder-gray-700";
const inpS: React.CSSProperties = {
  background: "#0d0d0d",
  border: "1px solid rgba(255,255,255,0.08)",
  fontFamily: "'Poppins', sans-serif",
};
const lbl = "block text-xs font-semibold text-gray-600 tracking-widest uppercase mb-2";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className={lbl} style={{ fontFamily: "'Poppins', sans-serif" }}>
      {children}
    </span>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      className={inp}
      style={inpS}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={(e) => {
        e.target.style.border = "1px solid rgba(249,115,22,0.4)";
        e.target.style.boxShadow = "0 0 12px rgba(249,115,22,0.08)";
      }}
      onBlur={(e) => {
        e.target.style.border = "1px solid rgba(255,255,255,0.08)";
        e.target.style.boxShadow = "none";
      }}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      className={inp}
      style={{ ...inpS, minHeight: `${rows * 28}px` }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={(e) => {
        e.target.style.border = "1px solid rgba(249,115,22,0.4)";
        e.target.style.boxShadow = "0 0 12px rgba(249,115,22,0.08)";
      }}
      onBlur={(e) => {
        e.target.style.border = "1px solid rgba(255,255,255,0.08)";
        e.target.style.boxShadow = "none";
      }}
    />
  );
}

function UploadField({
  label,
  accept,
  onUpload,
  currentUrl,
  loading,
}: {
  label: string;
  accept: string;
  onUpload: (file: File) => void;
  currentUrl?: string;
  loading?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <Label>{label}</Label>
      <div
        className="rounded-xl flex items-center gap-4 p-4 cursor-pointer hover:border-orange-500/40 transition-all duration-200"
        style={{ background: "#0d0d0d", border: "1px dashed rgba(255,255,255,0.1)" }}
        onClick={() => ref.current?.click()}
      >
        {currentUrl && accept.includes("image") ? (
          <img
            src={currentUrl}
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            style={{ border: "1px solid rgba(249,115,22,0.2)" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : currentUrl && accept.includes("audio") ? (
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#f97316">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        ) : (
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#555" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
        )}
        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
              <span className="text-gray-500 text-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Uploading…
              </span>
            </div>
          ) : currentUrl ? (
            <p className="text-xs text-gray-400 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {currentUrl.split("/").pop()}
            </p>
          ) : (
            <p className="text-xs text-gray-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Click to upload
            </p>
          )}
          <p className="text-xs text-gray-700 mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {accept.replace(/,/g, " /")}
          </p>
        </div>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#f97316" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <input
          ref={ref}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onUpload(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

function SaveBtn({ onClick, saving }: { onClick: () => void; saving: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2 disabled:opacity-50"
      style={{ borderRadius: "10px", fontFamily: "'Poppins', sans-serif" }}
    >
      {saving ? (
        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
      ) : (
        <>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Save Changes
        </>
      )}
    </button>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="p-6 rounded-[20px]"
      style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <h3
        className="text-white font-bold text-sm mb-6 pb-4"
        style={{
          fontFamily: "'Poppins', sans-serif",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

// ─── Tab: Profile ────────────────────────────────────────────────────────────
function ProfileTab({ content, onRefresh }: { content: ContentMap; onRefresh: () => void }) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileUrl, setProfileUrl] = useState(content["profile_image_url"] || "");
  const [greeting, setGreeting] = useState(content["hero_greeting"] || "Hi, I'm");
  const [name, setName] = useState(content["hero_name"] || "Adam");
  const [subtitle, setSubtitle] = useState(content["hero_subtitle"] || "");
  const [description, setDescription] = useState(content["hero_description"] || "");
  const [contactTitle, setContactTitle] = useState(content["contact_title"] || "");
  const [contactDesc, setContactDesc] = useState(content["contact_desc"] || "");
  const [whatsapp, setWhatsapp] = useState(content["whatsapp_number"] || "");
  const [toast, setToast] = useState("");

  useEffect(() => {
    setProfileUrl(content["profile_image_url"] || "");
    setGreeting(content["hero_greeting"] || "Hi, I'm");
    setName(content["hero_name"] || "Adam");
    setSubtitle(content["hero_subtitle"] || "");
    setDescription(content["hero_description"] || "");
    setContactTitle(content["contact_title"] || "");
    setContactDesc(content["contact_desc"] || "");
    setWhatsapp(content["whatsapp_number"] || "");
  }, [content]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleProfileUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const url = await uploadFile("profile", `profile.${ext}`, file);
      setProfileUrl(url);
      await setSiteContent("profile_image_url", url);
      onRefresh();
      showToast("Profile image updated!");
    } catch (e: any) {
      showToast("Upload failed: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await Promise.all([
      setSiteContent("hero_greeting", greeting),
      setSiteContent("hero_name", name),
      setSiteContent("hero_subtitle", subtitle),
      setSiteContent("hero_description", description),
      setSiteContent("contact_title", contactTitle),
      setSiteContent("contact_desc", contactDesc),
      setSiteContent("whatsapp_number", whatsapp),
    ]);
    onRefresh();
    setSaving(false);
    showToast("Hero content saved!");
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="Profile Picture">
        <UploadField
          label="Upload Profile Image"
          accept="image/png,image/jpeg,image/webp"
          onUpload={handleProfileUpload}
          currentUrl={profileUrl}
          loading={uploading}
        />
        {profileUrl && (
          <div className="mt-4 flex items-center gap-3">
            <img
              src={profileUrl}
              className="w-20 h-20 rounded-full object-cover"
              style={{ border: "2px solid rgba(249,115,22,0.4)" }}
            />
            <div>
              <p className="text-xs text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Current profile image</p>
              <p className="text-xs text-gray-600 mt-1 truncate max-w-xs" style={{ fontFamily: "'Poppins', sans-serif" }}>{profileUrl}</p>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Hero Text">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Greeting</Label>
            <Input value={greeting} onChange={setGreeting} placeholder="Hi, I'm" />
          </div>
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={setName} placeholder="Adam" />
          </div>
          <div className="col-span-2">
            <Label>Sub-headline</Label>
            <Input value={subtitle} onChange={setSubtitle} placeholder="Web Developer & Cybersecurity Enthusiast" />
          </div>
          <div className="col-span-2">
            <Label>Description paragraph</Label>
            <Textarea value={description} onChange={setDescription} placeholder="Short bio..." rows={3} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Contact & WhatsApp">
        <div className="flex flex-col gap-4">
          <div>
            <Label>WhatsApp Number</Label>
            <Input value={whatsapp} onChange={setWhatsapp} placeholder="+213551554758" />
          </div>
          <div>
            <Label>Contact Section Title</Label>
            <Input value={contactTitle} onChange={setContactTitle} placeholder="Have a Project?" />
          </div>
          <div>
            <Label>Contact Description</Label>
            <Textarea value={contactDesc} onChange={setContactDesc} rows={2} />
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <SaveBtn onClick={handleSave} saving={saving} />
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 right-8 px-5 py-3 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "#f97316",
              boxShadow: "0 0 30px rgba(249,115,22,0.4)",
              fontFamily: "'Poppins', sans-serif",
              zIndex: 999,
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tab: About & Stats ──────────────────────────────────────────────────────
function AboutTab({ content, onRefresh }: { content: ContentMap; onRefresh: () => void }) {
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [bio, setBio] = useState(content["about_bio"] || "");
  const [aName, setAName] = useState(content["about_name"] || "");
  const [location, setLocation] = useState(content["about_location"] || "");
  const [email, setEmail] = useState(content["about_email"] || "");
  const [status, setStatus] = useState(content["about_status"] || "");
  const [statYears, setStatYears] = useState(content["stat_years"] || "3+");
  const [statProjects, setStatProjects] = useState(content["stat_projects"] || "50+");
  const [statSatisfaction, setStatSatisfaction] = useState(content["stat_satisfaction"] || "100%");
  const [skills, setSkills] = useState([
    { name: content["skill_1_name"] || "React / Next.js", level: content["skill_1_level"] || "90" },
    { name: content["skill_2_name"] || "Node.js / Express", level: content["skill_2_level"] || "85" },
    { name: content["skill_3_name"] || "Cybersecurity", level: content["skill_3_level"] || "80" },
    { name: content["skill_4_name"] || "UI/UX Design", level: content["skill_4_level"] || "75" },
  ]);

  useEffect(() => {
    setBio(content["about_bio"] || "");
    setAName(content["about_name"] || "");
    setLocation(content["about_location"] || "");
    setEmail(content["about_email"] || "");
    setStatus(content["about_status"] || "");
    setStatYears(content["stat_years"] || "3+");
    setStatProjects(content["stat_projects"] || "50+");
    setStatSatisfaction(content["stat_satisfaction"] || "100%");
    setSkills([
      { name: content["skill_1_name"] || "React / Next.js", level: content["skill_1_level"] || "90" },
      { name: content["skill_2_name"] || "Node.js / Express", level: content["skill_2_level"] || "85" },
      { name: content["skill_3_name"] || "Cybersecurity", level: content["skill_3_level"] || "80" },
      { name: content["skill_4_name"] || "UI/UX Design", level: content["skill_4_level"] || "75" },
    ]);
  }, [content]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const handleSave = async () => {
    setSaving(true);
    await Promise.all([
      setSiteContent("about_bio", bio),
      setSiteContent("about_name", aName),
      setSiteContent("about_location", location),
      setSiteContent("about_email", email),
      setSiteContent("about_status", status),
      setSiteContent("stat_years", statYears),
      setSiteContent("stat_projects", statProjects),
      setSiteContent("stat_satisfaction", statSatisfaction),
      ...skills.flatMap((s, i) => [
        setSiteContent(`skill_${i + 1}_name`, s.name),
        setSiteContent(`skill_${i + 1}_level`, s.level),
      ]),
    ]);
    onRefresh();
    setSaving(false);
    showToast("About & Stats saved!");
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionCard title="About Me Text">
        <div className="flex flex-col gap-4">
          <div>
            <Label>Bio paragraph</Label>
            <Textarea value={bio} onChange={setBio} rows={4} placeholder="Long bio..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Name</Label><Input value={aName} onChange={setAName} placeholder="Adam" /></div>
            <div><Label>Location</Label><Input value={location} onChange={setLocation} placeholder="Algeria" /></div>
            <div><Label>Email</Label><Input value={email} onChange={setEmail} placeholder="hello@adam.dev" /></div>
            <div><Label>Status</Label><Input value={status} onChange={setStatus} placeholder="Available" /></div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Hero Stats Badges">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Years Experience</Label>
            <Input value={statYears} onChange={setStatYears} placeholder="3+" />
          </div>
          <div>
            <Label>Projects</Label>
            <Input value={statProjects} onChange={setStatProjects} placeholder="50+" />
          </div>
          <div>
            <Label>Satisfaction</Label>
            <Input value={statSatisfaction} onChange={setStatSatisfaction} placeholder="100%" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Technical Skills">
        <div className="flex flex-col gap-4">
          {skills.map((skill, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 items-end">
              <div className="col-span-2">
                <Label>Skill {i + 1} Name</Label>
                <Input
                  value={skill.name}
                  onChange={(v) => setSkills((prev) => prev.map((s, j) => j === i ? { ...s, name: v } : s))}
                  placeholder="React / Next.js"
                />
              </div>
              <div>
                <Label>Level %</Label>
                <Input
                  value={skill.level}
                  onChange={(v) => setSkills((prev) => prev.map((s, j) => j === i ? { ...s, level: v } : s))}
                  placeholder="90"
                  type="number"
                />
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <SaveBtn onClick={handleSave} saving={saving} />
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 right-8 px-5 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#f97316", boxShadow: "0 0 30px rgba(249,115,22,0.4)", fontFamily: "'Poppins', sans-serif", zIndex: 999 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tab: Books ──────────────────────────────────────────────────────────────
function BooksTab() {
  const [books, setBooks] = useState<Book[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<{ cover?: boolean; pdf?: boolean }>({});
  const [toast, setToast] = useState("");

  const blank = { title: "", description: "", cover_image_url: "", pdf_file: "", whatsapp_number: "+213551554758" };
  const [form, setForm] = useState({ ...blank });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const fetch = async () => {
    const { data } = await supabase.from("books").select("*").order("created_at", { ascending: false });
    if (data) setBooks(data);
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditId(null); setForm({ ...blank }); setShowForm(true); };
  const openEdit = (b: Book) => { setEditId(b.id); setForm(b); setShowForm(true); };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this book?")) return;
    await supabase.from("books").delete().eq("id", id);
    fetch();
    showToast("Book deleted.");
  };

  const handleUpload = async (field: "cover" | "pdf", file: File) => {
    setUploading((u) => ({ ...u, [field]: true }));
    try {
      const ext = file.name.split(".").pop();
      const path = field === "cover" ? `covers/${Date.now()}.${ext}` : `pdfs/${Date.now()}.${ext}`;
      const url = await uploadFile("books", path, file);
      setForm((f) => ({ ...f, [field === "cover" ? "cover_image_url" : "pdf_file"]: url }));
    } catch (e: any) {
      showToast("Upload failed: " + e.message);
    } finally {
      setUploading((u) => ({ ...u, [field]: false }));
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) { showToast("Book title is required."); return; }
    setSaving(true);
    if (editId) { await supabase.from("books").update(form).eq("id", editId); }
    else { await supabase.from("books").insert([form]); }
    await fetch();
    setSaving(false);
    setShowForm(false);
    setEditId(null);
    showToast(editId ? "Book updated!" : "Book added!");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2" style={{ borderRadius: "10px", fontFamily: "'Poppins', sans-serif" }}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Book
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <SectionCard title={editId ? "Edit Book" : "Add New Book"}>
              <div className="flex flex-col gap-4">
                <div>
                  <Label>Book Title *</Label>
                  <Input value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} placeholder="Enter book title" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} placeholder="Gloomy, captivating description..." rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <UploadField
                    label="Cover Image"
                    accept="image/png,image/jpeg,image/webp"
                    onUpload={(f) => handleUpload("cover", f)}
                    currentUrl={form.cover_image_url}
                    loading={uploading.cover}
                  />
                  <UploadField
                    label="PDF File"
                    accept=".pdf,application/pdf"
                    onUpload={(f) => handleUpload("pdf", f)}
                    currentUrl={form.pdf_file}
                    loading={uploading.pdf}
                  />
                </div>
                <div>
                  <Label>WhatsApp Number</Label>
                  <Input value={form.whatsapp_number} onChange={(v) => setForm((f) => ({ ...f, whatsapp_number: v }))} placeholder="+213551554758" />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button onClick={() => setShowForm(false)} className="btn-secondary text-sm py-2 px-4" style={{ borderRadius: "10px", fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
                  <SaveBtn onClick={handleSave} saving={saving} />
                </div>
              </div>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>

      {books.map((book, i) => (
        <motion.div
          key={book.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-center gap-5 p-5 rounded-[20px]"
          style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(249,115,22,0.15)" }}>
            {book.cover_image_url && (
              <img src={book.cover_image_url} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{book.title}</p>
            <p className="text-gray-600 text-xs mt-1 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{book.description?.substring(0, 80)}...</p>
            <div className="flex items-center gap-3 mt-2">
              {book.pdf_file && <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", fontFamily: "'Poppins', sans-serif" }}>PDF</span>}
              {book.cover_image_url && <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", fontFamily: "'Poppins', sans-serif" }}>Cover</span>}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => openEdit(book)} className="px-3 py-1.5 text-xs font-semibold rounded-lg" style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", fontFamily: "'Poppins', sans-serif" }}>Edit</button>
            <button onClick={() => handleDelete(book.id)} className="px-3 py-1.5 text-xs font-semibold rounded-lg" style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.15)", fontFamily: "'Poppins', sans-serif" }}>Delete</button>
          </div>
        </motion.div>
      ))}

      {books.length === 0 && !showForm && (
        <div className="text-center py-16 rounded-[20px]" style={{ background: "#0d0d0d", border: "1px dashed rgba(255,255,255,0.05)" }}>
          <p className="text-gray-700 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>No books yet. Click 'Add Book' to get started.</p>
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-8 right-8 px-5 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#f97316", boxShadow: "0 0 30px rgba(249,115,22,0.4)", fontFamily: "'Poppins', sans-serif", zIndex: 999 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tab: Podcasts ───────────────────────────────────────────────────────────
function PodcastsTab() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<{ audio?: boolean; cover?: boolean }>({});
  const [toast, setToast] = useState("");
  const blank = { episode_title: "", description: "", audio_file_url: "", cover_image: "" };
  const [form, setForm] = useState({ ...blank });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const fetch = async () => {
    const { data } = await supabase.from("podcasts").select("*").order("created_at", { ascending: false });
    if (data) setPodcasts(data);
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditId(null); setForm({ ...blank }); setShowForm(true); };
  const openEdit = (p: Podcast) => { setEditId(p.id); setForm(p); setShowForm(true); };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this episode?")) return;
    await supabase.from("podcasts").delete().eq("id", id);
    fetch();
    showToast("Episode deleted.");
  };

  const handleUpload = async (field: "audio" | "cover", file: File) => {
    setUploading((u) => ({ ...u, [field]: true }));
    try {
      const ext = file.name.split(".").pop();
      const path = field === "audio" ? `audio/${Date.now()}.${ext}` : `covers/${Date.now()}.${ext}`;
      const url = await uploadFile("podcasts", path, file);
      setForm((f) => ({ ...f, [field === "audio" ? "audio_file_url" : "cover_image"]: url }));
    } catch (e: any) {
      showToast("Upload failed: " + e.message);
    } finally {
      setUploading((u) => ({ ...u, [field]: false }));
    }
  };

  const handleSave = async () => {
    if (!form.episode_title.trim()) { showToast("Episode title is required."); return; }
    setSaving(true);
    if (editId) { await supabase.from("podcasts").update(form).eq("id", editId); }
    else { await supabase.from("podcasts").insert([form]); }
    await fetch();
    setSaving(false);
    setShowForm(false);
    setEditId(null);
    showToast(editId ? "Episode updated!" : "Episode added!");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2" style={{ borderRadius: "10px", fontFamily: "'Poppins', sans-serif" }}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Episode
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <SectionCard title={editId ? "Edit Episode" : "Add New Episode"}>
              <div className="flex flex-col gap-4">
                <div>
                  <Label>Episode Title *</Label>
                  <Input value={form.episode_title} onChange={(v) => setForm((f) => ({ ...f, episode_title: v }))} placeholder="Episode title" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(v) => setForm((f) => ({ ...f, description: v }))} placeholder="What's this episode about..." rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <UploadField
                    label="Audio File (MP3/WAV)"
                    accept="audio/mpeg,audio/wav,audio/mp3,.mp3,.wav"
                    onUpload={(f) => handleUpload("audio", f)}
                    currentUrl={form.audio_file_url}
                    loading={uploading.audio}
                  />
                  <UploadField
                    label="Cover Image"
                    accept="image/png,image/jpeg,image/webp"
                    onUpload={(f) => handleUpload("cover", f)}
                    currentUrl={form.cover_image}
                    loading={uploading.cover}
                  />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button onClick={() => setShowForm(false)} className="btn-secondary text-sm py-2 px-4" style={{ borderRadius: "10px", fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
                  <SaveBtn onClick={handleSave} saving={saving} />
                </div>
              </div>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>

      {podcasts.map((ep, i) => (
        <motion.div key={ep.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
          className="flex items-center gap-5 p-5 rounded-[20px]"
          style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(249,115,22,0.15)" }}>
            {ep.cover_image && <img src={ep.cover_image} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{ep.episode_title}</p>
            <p className="text-gray-600 text-xs mt-1 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{ep.description?.substring(0, 80)}</p>
            <div className="flex items-center gap-3 mt-2">
              {ep.audio_file_url && <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(139,92,246,0.1)", color: "#a78bfa", fontFamily: "'Poppins', sans-serif" }}>Audio</span>}
              {ep.cover_image && <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(34,197,94,0.08)", color: "#22c55e", fontFamily: "'Poppins', sans-serif" }}>Cover</span>}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => openEdit(ep)} className="px-3 py-1.5 text-xs font-semibold rounded-lg" style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", fontFamily: "'Poppins', sans-serif" }}>Edit</button>
            <button onClick={() => handleDelete(ep.id)} className="px-3 py-1.5 text-xs font-semibold rounded-lg" style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.15)", fontFamily: "'Poppins', sans-serif" }}>Delete</button>
          </div>
        </motion.div>
      ))}

      {podcasts.length === 0 && !showForm && (
        <div className="text-center py-16 rounded-[20px]" style={{ background: "#0d0d0d", border: "1px dashed rgba(255,255,255,0.05)" }}>
          <p className="text-gray-700 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>No episodes yet. Click 'Add Episode' to get started.</p>
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-8 right-8 px-5 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#f97316", boxShadow: "0 0 30px rgba(249,115,22,0.4)", fontFamily: "'Poppins', sans-serif", zIndex: 999 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Tab: Articles ───────────────────────────────────────────────────────────
function ArticlesTab() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState("");
  const blank = { article_title: "", full_content: "", featured_image: "" };
  const [form, setForm] = useState({ ...blank });

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const fetch = async () => {
    const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
    if (data) setArticles(data);
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditId(null); setForm({ ...blank }); setShowForm(true); };
  const openEdit = (a: Article) => { setEditId(a.id); setForm(a); setShowForm(true); };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    await supabase.from("articles").delete().eq("id", id);
    fetch();
    showToast("Article deleted.");
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const url = await uploadFile("articles", `featured/${Date.now()}.${ext}`, file);
      setForm((f) => ({ ...f, featured_image: url }));
    } catch (e: any) {
      showToast("Upload failed: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.article_title.trim()) { showToast("Article title is required."); return; }
    setSaving(true);
    if (editId) { await supabase.from("articles").update(form).eq("id", editId); }
    else { await supabase.from("articles").insert([form]); }
    await fetch();
    setSaving(false);
    setShowForm(false);
    setEditId(null);
    showToast(editId ? "Article updated!" : "Article published!");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2" style={{ borderRadius: "10px", fontFamily: "'Poppins', sans-serif" }}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Write Article
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <SectionCard title={editId ? "Edit Article" : "New Article"}>
              <div className="flex flex-col gap-4">
                <div>
                  <Label>Article Title *</Label>
                  <Input value={form.article_title} onChange={(v) => setForm((f) => ({ ...f, article_title: v }))} placeholder="Article title..." />
                </div>
                <UploadField
                  label="Featured Image"
                  accept="image/png,image/jpeg,image/webp"
                  onUpload={handleImageUpload}
                  currentUrl={form.featured_image}
                  loading={uploading}
                />
                {form.featured_image && (
                  <div className="rounded-xl overflow-hidden" style={{ maxHeight: 200 }}>
                    <img src={form.featured_image} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <Label>Main Content</Label>
                  <Textarea value={form.full_content} onChange={(v) => setForm((f) => ({ ...f, full_content: v }))} placeholder="Write your article content here..." rows={10} />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button onClick={() => setShowForm(false)} className="btn-secondary text-sm py-2 px-4" style={{ borderRadius: "10px", fontFamily: "'Poppins', sans-serif" }}>Cancel</button>
                  <SaveBtn onClick={handleSave} saving={saving} />
                </div>
              </div>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>

      {articles.map((article, i) => (
        <motion.div key={article.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
          className="flex items-center gap-5 p-5 rounded-[20px]"
          style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.05)" }}>
          {article.featured_image && (
            <div className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ border: "1px solid rgba(249,115,22,0.15)" }}>
              <img src={article.featured_image} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{article.article_title}</p>
            <p className="text-gray-600 text-xs mt-1 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>{article.full_content?.substring(0, 80)}...</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => openEdit(article)} className="px-3 py-1.5 text-xs font-semibold rounded-lg" style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.2)", fontFamily: "'Poppins', sans-serif" }}>Edit</button>
            <button onClick={() => handleDelete(article.id)} className="px-3 py-1.5 text-xs font-semibold rounded-lg" style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.15)", fontFamily: "'Poppins', sans-serif" }}>Delete</button>
          </div>
        </motion.div>
      ))}

      {articles.length === 0 && !showForm && (
        <div className="text-center py-16 rounded-[20px]" style={{ background: "#0d0d0d", border: "1px dashed rgba(255,255,255,0.05)" }}>
          <p className="text-gray-700 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>No articles yet. Click 'Write Article' to get started.</p>
        </div>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed bottom-8 right-8 px-5 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#f97316", boxShadow: "0 0 30px rgba(249,115,22,0.4)", fontFamily: "'Poppins', sans-serif", zIndex: 999 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main AdminPanel ─────────────────────────────────────────────────────────
export default function AdminPanel({ lang, onLogout }: AdminPanelProps) {
  const isAr = lang === "ar";
  const [tab, setTab] = useState<Tab>("profile");
  const [content, setContent] = useState<ContentMap>({});
  const [loadingContent, setLoadingContent] = useState(true);

  const refreshContent = async () => {
    const c = await getSiteContent();
    setContent(c);
    setLoadingContent(false);
  };

  useEffect(() => { refreshContent(); }, []);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: "profile",
      label: isAr ? "الملف الشخصي" : "Profile",
      icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
    },
    {
      key: "about",
      label: isAr ? "عني والإحصاء" : "About & Stats",
      icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    },
    {
      key: "books",
      label: isAr ? "الكتب" : "Books",
      icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    },
    {
      key: "podcasts",
      label: isAr ? "البودكاست" : "Podcasts",
      icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>,
    },
    {
      key: "articles",
      label: isAr ? "المقالات" : "Articles",
      icon: <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#000", paddingTop: "64px" }}>
      {/* Sidebar */}
      <aside
        className="w-56 fixed left-0 top-16 bottom-0 flex flex-col py-6 px-3"
        style={{ background: "#080808", borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex flex-col gap-1 flex-1">
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: tab === tb.key ? "rgba(249,115,22,0.1)" : "transparent",
                color: tab === tb.key ? "#f97316" : "#666",
                border: tab === tb.key ? "1px solid rgba(249,115,22,0.2)" : "1px solid transparent",
                fontFamily: "'Poppins', sans-serif",
                textAlign: "left",
              }}
            >
              {tb.icon}
              {tb.label}
            </button>
          ))}
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mt-4"
          style={{ color: "#ef4444", border: "1px solid rgba(239,68,68,0.15)", fontFamily: "'Poppins', sans-serif", textAlign: "left" }}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <h1
              className="text-2xl font-black text-white"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {tabs.find((t) => t.key === tab)?.label}
            </h1>
            <p
              className="text-gray-600 text-xs mt-1"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {tab === "profile" && "Manage your profile image, hero text, and contact info."}
              {tab === "about" && "Update your bio, skills, and stat numbers."}
              {tab === "books" && "Add, edit, or remove books with cover and PDF uploads."}
              {tab === "podcasts" && "Manage podcast episodes with audio and cover uploads."}
              {tab === "articles" && "Write and publish articles with featured images."}
            </p>
          </div>

          {loadingContent && (tab === "profile" || tab === "about") ? (
            <div className="flex items-center gap-3 py-12">
              <div className="w-5 h-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
              <span className="text-gray-600 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>Loading content…</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {tab === "profile" && <ProfileTab content={content} onRefresh={refreshContent} />}
                {tab === "about" && <AboutTab content={content} onRefresh={refreshContent} />}
                {tab === "books" && <BooksTab />}
                {tab === "podcasts" && <PodcastsTab />}
                {tab === "articles" && <ArticlesTab />}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
