export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#000005" }}>
      <div className="text-center">
        <p className="text-8xl font-light text-purple-900 mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>404</p>
        <p className="text-gray-600 text-sm tracking-widest uppercase">Page not found</p>
        <a href="/" className="mt-8 inline-block text-xs text-purple-400 tracking-widest hover:text-white transition-colors duration-300 uppercase border-b border-purple-800 pb-px">
          Return Home
        </a>
      </div>
    </div>
  );
}
