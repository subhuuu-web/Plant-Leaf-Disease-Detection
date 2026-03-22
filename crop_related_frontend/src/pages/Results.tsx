import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ResultsPanel from "../components/ResultsPanel";
import Header from "../components/Header";
import BackgroundEffects from "../components/BackgroundEffects";
import { useState, useEffect } from "react";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  // Safe extraction. The result will be populated here via react-router location state
  const result = location.state?.result;
  
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

  // If user navigates to /results manually without uploading an image, return them to landing
  if (!result) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen bg-background transition-colors duration-500">
      <BackgroundEffects />
      <Header isDark={isDark} onToggleTheme={() => setIsDark((d) => !d)} />

      <main className="relative pt-24 pb-20 px-4 flex flex-col items-center gap-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-full flex justify-start max-w-2xl mx-auto mb-2">
            <button 
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to Analysis
            </button>
        </div>
        <ResultsPanel result={result} />
      </main>

      {/* Footer */}
      <footer className="relative text-center py-8 text-xs text-muted-foreground">
        Built with care for farmers everywhere
      </footer>
    </div>
  );
}
