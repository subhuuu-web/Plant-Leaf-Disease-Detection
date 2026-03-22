import { motion } from "framer-motion";

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Gradient orb top-left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full animate-float"
        style={{
          background: "radial-gradient(circle, hsl(160 84% 39% / 0.08) 0%, transparent 70%)",
        }}
      />
      {/* Gradient orb bottom-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute -bottom-48 -right-32 w-[600px] h-[600px] rounded-full animate-float-delayed"
        style={{
          background: "radial-gradient(circle, hsl(160 84% 39% / 0.06) 0%, transparent 70%)",
        }}
      />
      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(hsl(160 84% 39% / 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, hsl(160 84% 39% / 0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Small floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/20"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -80, -160],
            x: [0, (i % 2 === 0 ? 20 : -20)],
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeOut",
          }}
          style={{
            left: `${15 + i * 18}%`,
            top: `${60 + (i % 3) * 10}%`,
          }}
        />
      ))}
    </div>
  );
}
