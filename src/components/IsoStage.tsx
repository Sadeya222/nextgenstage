import type { ReactElement } from "react";
import { motion } from "framer-motion";

const S = 34; // px per metre
const COS = Math.cos(Math.PI / 6);
const proj = (x: number, y: number, z: number): [number, number] => [(x - y) * COS * S, (x + y) * 0.5 * S - z * S];
const pt = (x: number, y: number, z: number) => proj(x, y, z).map((n) => n.toFixed(1)).join(",");
const poly = (...p: [number, number, number][]) => p.map(([x, y, z]) => pt(x, y, z)).join(" ");

interface Props {
  w: number;
  d: number;
  heightCm: number;
  valance: boolean;
  steps: boolean;
  ramp: boolean;
  tierRows?: number;
}

/** Lightweight isometric render of the configured stage — supports flat and tiered choir configurations. */
export function IsoStage({ w, d, heightCm, valance, steps, ramp, tierRows = 1 }: Props) {
  const tierCount = Math.max(1, Math.min(4, Math.round(tierRows)));
  const t = 0.03; // NexGen decks are 30mm thick
  const baseZTop = heightCm / 100;
  // Rows rise by 200mm toward the back of the choir layout.
  const getTierZ = (idx: number) => Math.min(1, (heightCm + (tierCount - 1 - idx) * 20) / 100);
  // For flat stage, single zTop; for tiered we use per-tier heights
  const zTop = tierCount === 1 ? baseZTop : getTierZ(tierCount - 1);
  const zBase = baseZTop - t;

  // Bounding box (px) for auto-fit — includes all tier heights
  const pts: [number, number][] = [];
  const add = (x: number, y: number, z: number) => pts.push(proj(x, y, z));
  if (tierCount === 1) {
    [0, w].forEach((x) =>
      [0, d].forEach((y) => {
        add(x, y, 0);
        add(x, y, zTop);
      }),
    );
  } else {
    for (let ti = 0; ti < tierCount; ti++) {
      const y0 = (d * ti) / tierCount;
      const y1 = (d * (ti + 1)) / tierCount;
      const zt = getTierZ(ti);
      [0, w].forEach((x) => {
        add(x, y0, 0);
        add(x, y0, zt);
        add(x, y1, 0);
        add(x, y1, zt);
      });
    }
  }
  add(-1.2, d * 0.3, 0);
  add(-1.2, d * 0.3, 1.95);
  if (steps) add(1.5, d + 0.6, 0);
  if (ramp) add(w + 1.4, d * 0.5, 0);
  const minX = Math.min(...pts.map((p) => p[0])) - 24;
  const maxX = Math.max(...pts.map((p) => p[0])) + 24;
  const minY = Math.min(...pts.map((p) => p[1])) - 20;
  const maxY = Math.max(...pts.map((p) => p[1])) + 26;

  // Build tier cell grids — flat or stepped choir rows
  const cells: ReactElement[] = [];
  if (tierCount === 1) {
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < d; j++) {
        cells.push(
          <polygon
            key={`${i}-${j}`}
            points={poly([i, j, zTop], [i + 1, j, zTop], [i + 1, j + 1, zTop], [i, j + 1, zTop])}
            fill={(i + j) % 2 === 0 ? "#2b3648" : "#334155"}
            stroke="#0f172a"
            strokeOpacity={0.55}
            strokeWidth={0.7}
          />,
        );
      }
    }
  } else {
    // Tiered: each choir row is a stepped strip along depth
    for (let ti = 0; ti < tierCount; ti++) {
      const y0 = (d * ti) / tierCount;
      const y1 = (d * (ti + 1)) / tierCount;
      const zt = getTierZ(ti);
      // Row shading gets slightly lighter as height increases for depth cue
      const baseShade = 0.18 + ti * 0.06;
      for (let i = 0; i < w; i++) {
        cells.push(
          <g key={`tier-${ti}-${i}`}>
            <polygon
              points={poly([i, y0, zt], [i + 1, y0, zt], [i + 1, y1, zt], [i, y1, zt])}
              fill={ti % 2 === 0 ? "#2b3648" : "#334155"}
              stroke="#0f172a"
              strokeOpacity={0.55}
              strokeWidth={0.7}
            />
            {/* Subtle row highlight */}
            <polygon
              points={poly([i, y0, zt], [i + 1, y0, zt], [i + 1, y1, zt], [i, y1, zt])}
              fill="#fff"
              fillOpacity={baseShade * 0.35}
              stroke="none"
            />
            {/* Tier label on first column for orientation */}
            {i === 0 && (
              <text
                x={proj((w + i) / 2, (y0 + y1) / 2, zt + 0.02)[0]}
                y={proj((w + i) / 2, (y0 + y1) / 2, zt + 0.02)[1]}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={w > 4 ? 7 : 6}
                fontWeight={800}
                fill="#a3e635"
                fillOpacity={0.95}
                paintOrder="stroke"
                stroke="#0a2a1a"
                strokeWidth={2.5}
                strokeOpacity={0.6}
              >
                ROW {ti + 1}
              </text>
            )}
          </g>
        );
      }
    }
  }

  const legs: ReactElement[] = [];
  if (!valance) {
    if (tierCount === 1) {
      for (let j = 0; j <= d; j++) legs.push(<Leg key={`r${j}`} x={w} y={j} zBase={zBase} />);
      for (let i = 0; i < w; i++) legs.push(<Leg key={`l${i}`} x={i} y={d} zBase={zBase} />);
    } else {
      // Each row has supports at both edges; the rear row is tallest.
      for (let ti = 0; ti < tierCount; ti++) {
        const y0 = (d * ti) / tierCount;
        const y1 = (d * (ti + 1)) / tierCount;
        const zb = getTierZ(ti) - t;
        for (let xi = 0; xi <= w; xi++) {
          legs.push(<Leg key={`tier-leg-back-${ti}-${xi}`} x={xi} y={y0} zBase={zb} />);
          legs.push(<Leg key={`tier-leg-front-${ti}-${xi}`} x={xi} y={y1} zBase={zb} />);
        }
      }
    }
  }

  const pleatsR: ReactElement[] = [];
  const pleatsL: ReactElement[] = [];
  if (valance) {
    if (tierCount === 1) {
      for (let j = 0; j <= d * 3; j++) {
        const yy = j / 3;
        pleatsR.push(<line key={j} x1={proj(w, yy, zBase)[0]} y1={proj(w, yy, zBase)[1]} x2={proj(w, yy, 0)[0]} y2={proj(w, yy, 0)[1]} stroke="#fff" strokeOpacity={0.09} strokeWidth={1} />);
      }
      for (let i = 0; i <= w * 3; i++) {
        const xx = i / 3;
        pleatsL.push(<line key={i} x1={proj(xx, d, zBase)[0]} y1={proj(xx, d, zBase)[1]} x2={proj(xx, d, 0)[0]} y2={proj(xx, d, 0)[1]} stroke="#fff" strokeOpacity={0.09} strokeWidth={1} />);
      }
    } else {
      // Tiered valance: pleats follow stepped front faces
      for (let ti = 0; ti < tierCount; ti++) {
        const y1 = (d * (ti + 1)) / tierCount;
        const zb = getTierZ(ti) - t;
        pleatsR.push(
          <line
            key={`vr-${ti}`}
            x1={proj(w, y1, zb)[0]}
            y1={proj(w, y1, zb)[1]}
            x2={proj(w, y1, 0)[0]}
            y2={proj(w, y1, 0)[1]}
            stroke="#fff"
            strokeOpacity={0.07}
            strokeWidth={1}
          />,
        );
      }
      for (let i = 0; i <= w * 3; i++) {
        const xx = i / 3;
        const zb = getTierZ(tierCount - 1) - t;
        pleatsL.push(<line key={i} x1={proj(xx, d, zb)[0]} y1={proj(xx, d, zb)[1]} x2={proj(xx, d, 0)[0]} y2={proj(xx, d, 0)[1]} stroke="#fff" strokeOpacity={0.09} strokeWidth={1} />);
      }
    }
  }

  const [px, py] = proj(-1.2, d * 0.3, 0);
  const stepsZ = Math.max(zTop / 2, 0.12);

  return (
    <svg
      viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
      role="img"
      aria-label={`Isometric preview of a ${w} by ${d} metre stage${tierCount > 1 ? ` with ${tierCount} choir rows stepping up toward the back` : ` at ${heightCm} centimetres high`}`}
    >
      <defs>
        <filter id="iso-blur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <linearGradient id="iso-top-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <motion.g key={`${w}-${d}-${heightCm}-${valance}-${steps}-${ramp}-${tierCount}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}>
        {/* ground shadow */}
        <polygon points={poly([-0.35, -0.35, 0], [w + 0.5, -0.35, 0], [w + 0.5, d + 0.5, 0], [-0.35, d + 0.5, 0])} fill="#000" fillOpacity={0.45} filter="url(#iso-blur)" />

        {legs}

        {/* Ramp (right side) */}
        {ramp && (
          <g>
            <polygon points={poly([w, d * 0.5 - 0.5, zBase + 0.02], [w, d * 0.5 + 0.5, zBase + 0.02], [w + 1.3, d * 0.5 + 0.5, 0], [w + 1.3, d * 0.5 - 0.5, 0])} fill="#94a3b8" stroke="#475569" strokeWidth={0.8} />
            <polygon points={poly([w + 1.3, d * 0.5 + 0.5, 0], [w + 1.3, d * 0.5 - 0.5, 0], [w + 1.3, d * 0.5 - 0.5, 0.03], [w + 1.3, d * 0.5 + 0.5, 0.03])} fill="#64748b" />
          </g>
        )}

        {/* Slab sides — flat vs tiered stepped choir risers */}
        {tierCount === 1 ? (
          <>
            <polygon points={poly([0, d, zTop], [w, d, zTop], [w, d, zBase], [0, d, zBase])} fill="#14492e" />
            <polygon points={poly([w, 0, zTop], [w, d, zTop], [w, d, zBase], [w, 0, zBase])} fill="#0a2a1a" />
            <polygon points={poly([0, d, zTop - t * 0.35], [w, d, zTop - t * 0.35], [w, d, zTop - t * 0.7], [0, d, zTop - t * 0.7])} fill="#a3e635" />
            <polygon points={poly([w, 0, zTop - t * 0.35], [w, d, zTop - t * 0.35], [w, d, zTop - t * 0.7], [w, 0, zTop - t * 0.7])} fill="#84cc16" />
          </>
        ) : (
          <>
            {Array.from({ length: tierCount }).map((_, ti) => {
              const idx = tierCount - 1 - ti; // draw back-to-front
              const y0 = (d * idx) / tierCount;
              const y1 = (d * (idx + 1)) / tierCount;
              const zt = getTierZ(idx);
              const zb = zt - t;
              return (
                <g key={`slab-${idx}`}>
                  {/* Platform side walls */}
                  <polygon points={poly([0, y1, zt], [w, y1, zt], [w, y1, zb], [0, y1, zb])} fill="#14492e" fillOpacity={0.95 - idx * 0.08} />
                  <polygon points={poly([w, y0, zt], [w, y1, zt], [w, y1, zb], [w, y0, zb])} fill="#0a2a1a" fillOpacity={0.95 - idx * 0.08} />
                  {idx === 0 && <polygon points={poly([0, y0, zt], [w, y0, zt], [w, y0, zb], [0, y0, zb])} fill="#0f2f1f" />}
                  {/* Lime edge trim */}
                  <polygon points={poly([0, y1, zt - t * 0.35], [w, y1, zt - t * 0.35], [w, y1, zt - t * 0.7], [0, y1, zt - t * 0.7])} fill="#a3e635" />
                  <polygon points={poly([w, y0, zt - t * 0.35], [w, y1, zt - t * 0.35], [w, y1, zt - t * 0.7], [w, y0, zt - t * 0.7])} fill="#84cc16" />
                </g>
              );
            })}
          </>
        )}

        {/* Valance skirting — flat vs tiered */}
        {valance && tierCount === 1 && (
          <g>
            <polygon points={poly([0, d, zBase], [w, d, zBase], [w, d, 0], [0, d, 0])} fill="#111827" />
            <polygon points={poly([w, 0, zBase], [w, d, zBase], [w, d, 0], [w, 0, 0])} fill="#05080c" />
            {pleatsL}
            {pleatsR}
          </g>
        )}
        {valance && tierCount > 1 && (
          <g>
            {Array.from({ length: tierCount }).map((_, idx) => {
              const y1 = (d * (idx + 1)) / tierCount;
              const y0 = (d * idx) / tierCount;
              const zb = getTierZ(idx) - t;
              return (
                <g key={`val-${idx}`}>
                  <polygon points={poly([0, y1, zb], [w, y1, zb], [w, y1, 0], [0, y1, 0])} fill="#111827" fillOpacity={0.92} />
                  {idx === 0 && <polygon points={poly([w, y0, zb], [w, (d * (idx + 1)) / tierCount, zb], [w, (d * (idx + 1)) / tierCount, 0], [w, y0, 0])} fill="#05080c" />}
                  {idx === tierCount - 1 && <polygon points={poly([w, (d * idx) / tierCount, zb], [w, d, zb], [w, d, 0], [w, (d * idx) / tierCount, 0])} fill="#05080c" />}
                </g>
              );
            })}
            {pleatsL}
            {pleatsR}
          </g>
        )}

        {/* Top surface — cells (grid) + sheen */}
        {cells}
        {tierCount === 1 ? (
          <polygon points={poly([0, 0, zTop], [w, 0, zTop], [w, d, zTop], [0, d, zTop])} fill="url(#iso-top-sheen)" pointerEvents="none" />
        ) : (
          Array.from({ length: tierCount }).map((_, idx) => {
            const y0 = (d * idx) / tierCount;
            const y1 = (d * (idx + 1)) / tierCount;
            const zt = getTierZ(idx);
            return <polygon key={`sheen-${idx}`} points={poly([0, y0, zt], [w, y0, zt], [w, y1, zt], [0, y1, zt])} fill="url(#iso-top-sheen)" pointerEvents="none" />;
          })
        )}

        {/* Steps */}
        {steps && (
          <g>
            <polygon points={poly([0.4, d, stepsZ], [1.4, d, stepsZ], [1.4, d + 0.55, stepsZ], [0.4, d + 0.55, stepsZ])} fill="#cbd5e1" stroke="#64748b" strokeWidth={0.8} />
            <polygon points={poly([0.4, d + 0.55, stepsZ], [1.4, d + 0.55, stepsZ], [1.4, d + 0.55, 0], [0.4, d + 0.55, 0])} fill="#64748b" />
            <polygon points={poly([1.4, d, stepsZ], [1.4, d + 0.55, stepsZ], [1.4, d + 0.55, 0], [1.4, d, 0])} fill="#475569" />
          </g>
        )}

        {/* Person for scale — human figure retained, scale label removed per updated requirement */}
        <g opacity={0.95} aria-hidden="true">
          <ellipse cx={px} cy={py} rx={9} ry={3.5} fill="#000" fillOpacity={0.35} />
          <rect x={px - 6} y={py - 1.1 * S} width={12} height={1.1 * S} rx={5} fill="#a3e635" />
          <rect x={px - 8} y={py - 1.5 * S} width={16} height={0.62 * S} rx={7} fill="#d9f99d" />
          <circle cx={px} cy={py - 1.68 * S} r={5.2} fill="#ecfccb" />
        </g>
      </motion.g>
    </svg>
  );
}

function Leg({ x, y, zBase }: { x: number; y: number; zBase: number }) {
  const [x1, y1] = proj(x, y, zBase);
  const [x2, y2] = proj(x, y, 0);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#15803d" strokeWidth={3.2} strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a3e635" strokeOpacity={0.5} strokeWidth={1} strokeLinecap="round" />
      <ellipse cx={x2} cy={y2} rx={4.4} ry={1.8} fill="#cbd5e1" />
    </g>
  );
}
