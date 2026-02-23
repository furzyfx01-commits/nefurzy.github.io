import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { Link } from "wouter";

interface GlassCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  delay?: number;
  href?: string;
}

export function GlassCard({ id, title, description, image, delay = 0, href }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, type: "spring" }}
      className="h-full group-hover/card-grid:opacity-30 hover:!opacity-100 transition-all duration-700 ease-out perspective-2000"
    >
      <TiltCard className="glass-card rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden group h-full">
        {/* Internal glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div 
          style={{ transform: "translateZ(75px)" }}
          className="relative z-10 w-full mb-6 aspect-square rounded-2xl overflow-hidden glass border-0 flex items-center justify-center bg-black/20"
        >
          <motion.img
            src={image}
            alt={title}
            className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay * 2,
            }}
          />
        </div>

        <h3 
          style={{ transform: "translateZ(60px)" }}
          className="text-2xl font-display font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors"
        >
          {title}
        </h3>
        <p 
          style={{ transform: "translateZ(40px)" }}
          className="text-blue-100/70 leading-relaxed mb-6"
        >
          {description}
        </p>

        <Link href={`/service/${id}`}>
          <button 
            style={{ transform: "translateZ(80px)" }}
            className="mt-auto flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-100 transition-colors group/btn"
          >
            Learn more <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </Link>
      </TiltCard>
    </motion.div>
  );
}
