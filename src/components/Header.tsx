import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Inventory", path: "/#inventory" },
  { label: "About", path: "/#about" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleNavClick = (path: string) => {
    if (path.startsWith("/#")) {
      const id = path.slice(2);
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-heavy shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Bikes Bazar" className="h-10 md:h-12 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.path}
              to={l.path.startsWith("/#") ? "/" : l.path}
              onClick={() => handleNavClick(l.path)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/admin"
            className="text-sm font-medium px-4 py-2 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-all haptic"
          >
            Admin
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-foreground haptic p-2"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-heavy overflow-hidden"
          >
            <nav className="container py-6 flex flex-col gap-4">
              {navLinks.map((l) => (
                <Link
                  key={l.path}
                  to={l.path.startsWith("/#") ? "/" : l.path}
                  onClick={() => handleNavClick(l.path)}
                  className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/admin"
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
