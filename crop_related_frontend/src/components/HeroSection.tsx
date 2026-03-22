import { motion } from "framer-motion";
import { Shield, Zap, BarChart3 } from "lucide-react";
import heroLeaf from "@/assets/hero-leaf.jpg";

const features = [
  { icon: Zap, title: "Instant Detection", desc: "AI-powered analysis in seconds" },
  { icon: Shield, title: "38+ Diseases", desc: "Broad coverage across crop types" },
  { icon: BarChart3, title: "Confidence Scoring", desc: "Quantified diagnostic certainty" },
];

export default function HeroSection() {
  return (
    <section className="relative w-full max-w-5xl mx-auto">
      {/* Hero image with overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-48 sm:h-56 rounded-3xl overflow-hidden mb-8"
      >
        <img
          src={heroLeaf}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl font-extrabold text-gradient leading-tight"
            style={{ lineHeight: "1.1" }}
          >
            Protect Your Crops
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-2 text-sm sm:text-base text-muted-foreground max-w-md"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Upload a photo of any plant leaf and get AI-driven disease diagnosis with actionable treatment plans.
          </motion.p>
        </div>
      </motion.div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: 0.6 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card flex items-center gap-2.5 px-4 py-2.5 hover:glow-sm transition-shadow duration-300 group cursor-default"
          >
            <div className="relative">
              <f.icon className="h-4 w-4 text-primary transition-transform duration-200 group-hover:scale-110" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">{f.title}</p>
              <p className="text-[11px] text-muted-foreground">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
