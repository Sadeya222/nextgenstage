import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface Props {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  id?: string;
  className?: string;
}

export function SectionHeading({ eyebrow, title, description, tone = "light", align = "left", id, className }: Props) {
  const dark = tone === "dark";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}
    >
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em]",
          dark ? "bg-electric/15 text-electric ring-1 ring-electric/30" : "bg-forest-900 text-electric",
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-electric" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2
        id={id}
        className={cn(
          "mt-4 text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-[44px]",
          dark ? "text-white" : "text-forest-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", dark ? "text-white/75" : "text-slate-600")}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
