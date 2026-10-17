import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

/** Smoothly counts between values – used for the live price estimate. */
export function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const controls = animate(prev.current, value, {
      duration: 0.55,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
      onComplete: () => {
        prev.current = value;
      },
    });
    prev.current = value;
    return () => controls.stop();
  }, [value]);

  return <span className="tabular-nums">{format(display)}</span>;
}
