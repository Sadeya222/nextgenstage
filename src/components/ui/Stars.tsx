import { Star, StarHalf } from "lucide-react";
import { cn } from "@/utils/cn";

export function Stars({ rating, className, size = "h-4 w-4" }: { rating: number; className?: string; size?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`Rated ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const full = rating >= i;
        const half = !full && rating >= i - 0.5;
        return (
          <span key={i} className="relative inline-block">
            <Star className={cn(size, "text-slate-300")} fill="currentColor" aria-hidden="true" />
            {(full || half) && (
              <span className="absolute inset-0">
                {full ? (
                  <Star className={cn(size, "text-amber-400")} fill="currentColor" aria-hidden="true" />
                ) : (
                  <StarHalf className={cn(size, "text-amber-400")} fill="currentColor" aria-hidden="true" />
                )}
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}
