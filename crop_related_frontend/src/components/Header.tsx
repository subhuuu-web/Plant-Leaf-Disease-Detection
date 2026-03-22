import { motion } from "framer-motion";
import { Leaf, Moon, Sun } from "lucide-react";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Header({ isDark, onToggleTheme }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-5 py-3 mx-auto max-w-5xl"
    >
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <Leaf className="h-5 w-5 text-primary" />
          <div className="absolute inset-0 blur-md bg-primary/30 rounded-full" />
        </div>
        <span className="text-base font-semibold tracking-tight text-foreground">
          CropGuard AI
        </span>
        <span className="hidden sm:inline-flex text-[10px] font-medium uppercase tracking-widest text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full">
          Beta
        </span>
      </div>

      <button
        onClick={onToggleTheme}
        aria-label="Toggle theme"
        className="relative glass-card p-2 transition-all duration-200 active:scale-95 hover:scale-105 hover:glow-sm group"
      >
        <motion.div
          key={isDark ? "sun" : "moon"}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-primary" />
          ) : (
            <Moon className="h-4 w-4 text-foreground" />
          )}
        </motion.div>
      </button>
    </motion.header>
  );
}
