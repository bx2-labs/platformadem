-- ============================================================
-- Sirian Platform - Run in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Books table
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  cover_image_url TEXT DEFAULT '',
  pdf_file TEXT DEFAULT '',
  whatsapp_number TEXT DEFAULT '+213551554758',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Podcasts table
CREATE TABLE IF NOT EXISTS podcasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  episode_title TEXT NOT NULL,
  audio_file_url TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_title TEXT NOT NULL,
  full_content TEXT DEFAULT '',
  featured_image TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site content table (single-row dynamic content for hero/about)
CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site content rows
INSERT INTO site_content (key, value) VALUES
  ('hero_greeting', 'Hi, I''m'),
  ('hero_name', 'Adam'),
  ('hero_subtitle', 'Web Developer & Cybersecurity Enthusiast'),
  ('hero_description', 'I craft digital experiences where beauty meets performance and security. Ready to turn your vision into reality.'),
  ('profile_image_url', ''),
  ('about_bio', 'I''m a passionate web developer and cybersecurity specialist who believes technology should be beautiful, secure, and impactful. I build digital solutions where exceptional design meets clean code and robust protection.'),
  ('about_name', 'Adam'),
  ('about_location', 'Algeria'),
  ('about_email', 'hello@adam.dev'),
  ('about_status', 'Available'),
  ('stat_years', '3+'),
  ('stat_projects', '50+'),
  ('stat_satisfaction', '100%'),
  ('skill_1_name', 'React / Next.js'),
  ('skill_1_level', '90'),
  ('skill_2_name', 'Node.js / Express'),
  ('skill_2_level', '85'),
  ('skill_3_name', 'Cybersecurity'),
  ('skill_3_level', '80'),
  ('skill_4_name', 'UI/UX Design'),
  ('skill_4_level', '75'),
  ('whatsapp_number', '+213551554758'),
  ('contact_title', 'Have a Project?'),
  ('contact_desc', 'I''m available for new projects. Reach out and let''s build something extraordinary together.')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read books" ON books FOR SELECT USING (true);
CREATE POLICY "Public read podcasts" ON podcasts FOR SELECT USING (true);
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);

-- Full write policies (admin panel uses anon key)
CREATE POLICY "Admin write books" ON books FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write podcasts" ON podcasts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write articles" ON articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin write site_content" ON site_content FOR ALL USING (true) WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE books;
ALTER PUBLICATION supabase_realtime ADD TABLE podcasts;
ALTER PUBLICATION supabase_realtime ADD TABLE articles;
ALTER PUBLICATION supabase_realtime ADD TABLE site_content;

-- ============================================================
-- STORAGE BUCKETS
-- Run these separately or they may error if already exist
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('profile', 'profile', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('books', 'books', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('podcasts', 'podcasts', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('articles', 'articles', true) ON CONFLICT DO NOTHING;

-- Storage policies (allow public read + anon upload)
CREATE POLICY "Public read profile" ON storage.objects FOR SELECT USING (bucket_id = 'profile');
CREATE POLICY "Anon upload profile" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile');
CREATE POLICY "Anon update profile" ON storage.objects FOR UPDATE USING (bucket_id = 'profile');
CREATE POLICY "Anon delete profile" ON storage.objects FOR DELETE USING (bucket_id = 'profile');

CREATE POLICY "Public read books" ON storage.objects FOR SELECT USING (bucket_id = 'books');
CREATE POLICY "Anon upload books" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'books');
CREATE POLICY "Anon update books" ON storage.objects FOR UPDATE USING (bucket_id = 'books');
CREATE POLICY "Anon delete books" ON storage.objects FOR DELETE USING (bucket_id = 'books');

CREATE POLICY "Public read podcasts" ON storage.objects FOR SELECT USING (bucket_id = 'podcasts');
CREATE POLICY "Anon upload podcasts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'podcasts');
CREATE POLICY "Anon update podcasts" ON storage.objects FOR UPDATE USING (bucket_id = 'podcasts');
CREATE POLICY "Anon delete podcasts" ON storage.objects FOR DELETE USING (bucket_id = 'podcasts');

CREATE POLICY "Public read articles" ON storage.objects FOR SELECT USING (bucket_id = 'articles');
CREATE POLICY "Anon upload articles" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'articles');
CREATE POLICY "Anon update articles" ON storage.objects FOR UPDATE USING (bucket_id = 'articles');
CREATE POLICY "Anon delete articles" ON storage.objects FOR DELETE USING (bucket_id = 'articles');
