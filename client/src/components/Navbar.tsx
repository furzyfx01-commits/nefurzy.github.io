import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [studioName, setStudioName] = useState("DES STUDIO");
  const [studioLogo, setStudioLogo] = useState("");

  const convertDriveLink = (url: string) => {
    if (!url) return "";
    if (typeof url === "string" && url.includes("drive.google.com")) {
      const match = url.match(/\/d\/(.+?)\/(view|edit)/) || url.match(/id=(.+?)(&|$)/);
      if (match && match[1]) {
        return `https://lh3.googleusercontent.com/u/0/d/${match[1]}`;
      }
    }
    return url;
  };

  const loadData = () => {
    const savedSettings = localStorage.getItem("admin_settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setStudioName(settings.studioName || "DES STUDIO");
      setStudioLogo(convertDriveLink(settings.studioLogo) || "");
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", loadData);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "glass-nav py-3" : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <div className="text-2xl font-bold font-display tracking-tighter text-white flex items-center gap-2 cursor-pointer">
            {studioLogo ? (
              <img src={studioLogo} className="w-8 h-8 rounded-full object-cover border border-white/10" alt="Logo" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 blur-[2px] opacity-80" />
            )}
            <span className="text-glow">{studioName}</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {["Home", "Features", "Gallery", "About"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-white/80 hover:text-white transition-colors text-sm font-medium tracking-wide"
            >
              {item}
            </a>
          ))}
          <button className="glass px-6 py-2 rounded-full text-white text-sm font-semibold hover:bg-white/10 transition-all border border-white/20 hover:border-white/40 shadow-[0_0_15px_rgba(100,200,255,0.3)] hover:shadow-[0_0_25px_rgba(100,200,255,0.5)]">
            Get Started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden glass mt-4 rounded-2xl mx-4"
          >
            <div className="flex flex-col p-6 gap-4">
              {["Home", "Features", "Gallery", "About"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-white/80 hover:text-white text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className="w-full mt-2 glass py-3 rounded-xl text-white font-semibold">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
