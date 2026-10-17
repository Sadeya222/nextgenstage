import { useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useDialog } from "@/hooks/useDialog";
import { cn } from "@/utils/cn";

interface OverlayProps {
  open: boolean;
  onClose: () => void;
  label: string;
  side?: "center" | "right" | "left";
  className?: string;
  children: ReactNode;
  hideClose?: boolean;
  closeTone?: "light" | "dark";
}

function Panel({
  onClose,
  label,
  side,
  className,
  children,
  hideClose,
  closeTone,
}: Omit<OverlayProps, "open">) {
  const ref = useRef<HTMLDivElement>(null);
  useDialog(ref, true, onClose);

  const variants =
    side === "center"
      ? { initial: { opacity: 0, y: 24, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 16, scale: 0.98 } }
      : {
          initial: { x: side === "right" ? "100%" : "-100%" },
          animate: { x: 0 },
          exit: { x: side === "right" ? "100%" : "-100%" },
        };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex",
        side === "center" && "items-center justify-center p-4",
        side === "right" && "justify-end",
        side === "left" && "justify-start",
      )}
    >
      <motion.div
        className="absolute inset-0 bg-forest-950/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        {...variants}
        transition={{ type: "spring", damping: 30, stiffness: 320 }}
        className={cn("relative outline-none", className)}
      >
        {!hideClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${label}`}
            className={cn(
              "absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105",
              closeTone === "light"
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200",
            )}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
        {children}
      </motion.div>
    </div>
  );
}

export function Overlay({ open, side = "center", ...rest }: OverlayProps) {
  return (
    <AnimatePresence>
      {open && <Panel side={side} {...rest} />}
    </AnimatePresence>
  );
}
