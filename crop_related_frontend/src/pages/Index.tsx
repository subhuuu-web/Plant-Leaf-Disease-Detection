import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import BackgroundEffects from "../components/BackgroundEffects";
import DropZone from "../components/DropZone";
import { useUpload } from "../hooks/useUpload";

export default function Index() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
    return true;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const { upload, isLoading, result } = useUpload();
  const navigate = useNavigate();

  useEffect(() => {
    if (result) {
      navigate("/results", { state: { result } });
    }
  }, [result, navigate]);

  return (
    <div className="relative min-h-screen bg-background transition-colors duration-500">
      <BackgroundEffects />
      <Header isDark={isDark} onToggleTheme={() => setIsDark((d) => !d)} />

      <main className="relative pt-24 pb-20 px-4 flex flex-col items-center gap-8 max-w-5xl mx-auto">
        <HeroSection />
        <DropZone onAnalyze={upload} isLoading={isLoading} />
      </main>

      {/* Footer */}
      <footer className="relative text-center py-8 text-xs text-muted-foreground">
        Built with care for farmers everywhere
      </footer>
    </div>
  );
}
