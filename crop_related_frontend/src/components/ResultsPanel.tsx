import { motion } from "framer-motion";
import { AlertTriangle, Shield, Activity } from "lucide-react";
import ConfidenceGauge from "./ConfidenceGauge";
import type { PredictionResult } from "../hooks/useUpload";

interface ResultsPanelProps {
  result: PredictionResult;
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card glow-sm p-6 sm:p-8 w-full max-w-3xl mx-auto relative overflow-hidden"
    >
      {/* Top edge glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Left: Gauge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center shrink-0"
        >
          <ConfidenceGauge value={result.confidence} />
        </motion.div>

        {/* Right: Details */}
        <div className="flex-1 space-y-5 min-w-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                Diagnosis
              </span>
            </div>
            <h2
              className="text-xl sm:text-2xl font-bold text-foreground leading-tight"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {result.disease}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-4 space-y-1.5"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              Causes
            </div>
            <p className="text-sm leading-relaxed text-foreground/80 max-w-prose" style={{ textWrap: "pretty" } as React.CSSProperties}>
              {result.causes}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-4 space-y-1.5"
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Recommended Action
            </div>
            <p className="text-sm leading-relaxed text-foreground/80 max-w-prose" style={{ textWrap: "pretty" } as React.CSSProperties}>
              {result.recommendation}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
