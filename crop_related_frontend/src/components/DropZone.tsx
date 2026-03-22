import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Scan, ImagePlus } from "lucide-react";

interface DropZoneProps {
  onAnalyze: (file: File) => void;
  isLoading: boolean;
}

export default function DropZone({ onAnalyze, isLoading }: DropZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped?.type.startsWith("image/")) handleFile(dropped);
    },
    [handleFile]
  );

  const handleRemove = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card glow-sm p-6 sm:p-8 w-full max-w-xl mx-auto relative overflow-hidden"
    >
      {/* Subtle inner glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-5 rounded-xl border-2 border-dashed p-10 sm:p-14 cursor-pointer transition-all duration-300 group ${
              isDragOver
                ? "border-primary/50 bg-primary/5 scale-[1.01]"
                : "border-border hover:border-primary/25 hover:bg-primary/[0.02]"
            }`}
          >
            <motion.div
              animate={isDragOver ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ImagePlus className="h-7 w-7 text-primary" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>

            <div className="text-center">
              <p className="text-sm font-medium text-foreground mb-1">
                Drop your plant image here
              </p>
              <p className="text-xs text-muted-foreground">
                or click to browse · JPG, PNG, WebP
              </p>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5"
          >
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden group">
              <img src={preview} alt="Plant preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={handleRemove}
                disabled={isLoading}
                className="glass-card flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium text-foreground transition-all duration-150 active:scale-[0.97] hover:scale-[1.02] disabled:opacity-50"
              >
                <X className="h-4 w-4" /> Remove
              </button>
              <button
                onClick={() => file && onAnalyze(file)}
                disabled={isLoading}
                className="relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-2xl bg-primary text-primary-foreground transition-all duration-150 active:scale-[0.97] hover:scale-[1.02] disabled:opacity-70 overflow-hidden group"
              >
                {/* Button glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-400 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-2">
                  {isLoading ? (
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <Scan className="h-4 w-4" />
                  )}
                  {isLoading ? "Analyzing…" : "Analyze Plant"}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
