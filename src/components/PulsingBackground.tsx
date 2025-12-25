"use client";

import { useEffect, useRef, useState } from "react";

// --- Color Configuration ---
// Dark mode colors
const DARK_BG = "#0F0F0F";
const DARK_PANEL = "#1A1A1A";

// Light mode colors
const LIGHT_BG = "#F9FAFB";
const LIGHT_PANEL = "#E5E7EB";

// Color palette: purple → blue → green → yellow → orange
const NEON_PALETTE = ["#8338EC", "#3A86FF", "#06FFA5", "#FFBE0B", "#FB5607"];
// Softer palette for light mode
const LIGHT_PALETTE = ["#7C3AED", "#2563EB", "#059669", "#D97706", "#EA580C"];

// Lo-Fi rhythm: soft, subtle pulses
const RHYTHM = { base: 0.4, frequency: 0.02, decay: 0.95, amplitude: 0.5 };

// Visual settings
const SETTINGS = {
  colorTransitionSpeed: 64,
  pulseAmplitude: 1.0,
  lightRadiusMultiplier: 0.875,
  lightConcentration: 0.03,
  persistenceFactor: 0.02,
  gridScaleFactor: 0.35,
};

export default function PulsingBackground() {
  const canvasLightRef = useRef<HTMLCanvasElement>(null);
  const canvasGridRef = useRef<HTMLCanvasElement>(null);
  const currentPulseIntensity = useRef(0.0);
  const [isDark, setIsDark] = useState(true);

  // Listen for theme changes
  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkTheme();

    // Listen for theme change events from ThemeToggle
    const handleThemeChange = (e: CustomEvent<{ theme: string }>) => {
      setIsDark(e.detail.theme === "dark");
    };

    window.addEventListener("theme-change", handleThemeChange as EventListener);

    // Also observe class changes on html element
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.removeEventListener(
        "theme-change",
        handleThemeChange as EventListener,
      );
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvasLight = canvasLightRef.current;
    const canvasGrid = canvasGridRef.current;

    if (!canvasLight || !canvasGrid) return;

    // Theme-aware colors
    const HEX_BG = isDark ? DARK_BG : LIGHT_BG;
    const HEX_HL = isDark ? DARK_PANEL : LIGHT_PANEL;
    const colorPalette = isDark ? NEON_PALETTE : LIGHT_PALETTE;

    const canvases = [canvasLight, canvasGrid];
    let w: number, h: number, _min: number;
    const ctx: CanvasRenderingContext2D[] = [];
    let grid: Grid;
    let source: { x: number; y: number } | null = null;
    let t = 0;
    let request_id: number | null = null;

    const { cos, sin, sqrt, PI, min, random } = Math;

    // --- Hexagon Geometry ---
    const SCALE = SETTINGS.gridScaleFactor;
    const HEX_CRAD = 32 * SCALE;
    const HEX_HLW = 2 * SCALE;
    const HEX_GAP = 4 * SCALE;

    const unit_x = 3 * HEX_CRAD + HEX_GAP * sqrt(3);
    const unit_y = HEX_CRAD * sqrt(3) * 0.5 + 0.5 * HEX_GAP;
    const off_x = 1.5 * HEX_CRAD + HEX_GAP * sqrt(3) * 0.5;

    const T_SWITCH = SETTINGS.colorTransitionSpeed;

    const wp = colorPalette.map((c) => {
      const num = Number.parseInt(c.replace("#", ""), 16);
      return { r: (num >> 16) & 0xff, g: (num >> 8) & 0xff, b: num & 0xff };
    });
    const nwp = wp.length;
    let csi = 0;
    const f = 1 / T_SWITCH;

    // --- Grid Classes ---
    class GridItem {
      x: number;
      y: number;
      points: {
        hex: Array<{ x: number; y: number }>;
        hl: Array<{ x: number; y: number }>;
      };

      constructor(x?: number, y?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.points = { hex: [], hl: [] };
        this.init();
      }

      init() {
        const ba = PI / 3;
        const ri = HEX_CRAD - 0.5 * HEX_HLW;
        for (let i = 0; i < 6; i++) {
          const a = i * ba;
          const x = this.x + HEX_CRAD * cos(a);
          const y = this.y + HEX_CRAD * sin(a);
          this.points.hex.push({ x, y });
          if (i > 2) {
            const hlx = this.x + ri * cos(a);
            const hly = this.y + ri * sin(a);
            this.points.hl.push({ x: hlx, y: hly });
          }
        }
      }

      draw(ct: CanvasRenderingContext2D) {
        for (let i = 0; i < 6; i++) {
          if (i === 0) {
            ct.moveTo(this.points.hex[i].x, this.points.hex[i].y);
          } else {
            ct.lineTo(this.points.hex[i].x, this.points.hex[i].y);
          }
        }
      }

      highlight(ct: CanvasRenderingContext2D) {
        for (let i = 0; i < 3; i++) {
          if (i === 0) {
            ct.moveTo(this.points.hl[i].x, this.points.hl[i].y);
          } else {
            ct.lineTo(this.points.hl[i].x, this.points.hl[i].y);
          }
        }
      }
    }

    class Grid {
      cols: number;
      rows: number;
      items: GridItem[];
      n: number;

      constructor(rows?: number, cols?: number) {
        this.cols = cols || 16;
        this.rows = rows || 16;
        this.items = [];
        this.n = 0;
        this.init();
      }

      init() {
        for (let row = 0; row < this.rows; row++) {
          const y = row * unit_y;
          for (let col = 0; col < this.cols; col++) {
            const x = (row % 2 === 0 ? 0 : off_x) + col * unit_x;
            this.items.push(new GridItem(x, y));
          }
        }
        this.n = this.items.length;
      }

      draw(ct: CanvasRenderingContext2D) {
        ct.fillStyle = HEX_BG;
        ct.beginPath();
        for (let i = 0; i < this.n; i++) {
          this.items[i].draw(ct);
        }
        ct.closePath();
        ct.fill();
        ct.strokeStyle = HEX_HL;
        ct.beginPath();
        for (let i = 0; i < this.n; i++) {
          this.items[i].highlight(ct);
        }
        ct.closePath();
        ct.stroke();
      }
    }

    const init = () => {
      const s = getComputedStyle(canvases[0]);
      w = ~~s.width.split("px")[0];
      h = ~~s.height.split("px")[0];
      _min = 0.75 * min(w, h);

      const rows = ~~(h / unit_y) + 2;
      const cols = ~~(w / unit_x) + 2;

      // Account for high-DPI displays
      const dpr = window.devicePixelRatio || 1;

      for (let i = 0; i < canvases.length; i++) {
        // Set canvas buffer size to match device pixels
        canvases[i].width = w * dpr;
        canvases[i].height = h * dpr;
        // Keep CSS size the same
        canvases[i].style.width = w + "px";
        canvases[i].style.height = h + "px";
        const context = canvases[i].getContext("2d");
        if (context) {
          // Scale all drawing operations by DPR
          context.scale(dpr, dpr);
          ctx[i] = context;
        }
      }

      grid = new Grid(rows, cols);
      grid.draw(ctx[1]);

      if (!source) {
        source = { x: ~~(w / 2), y: ~~(h / 2) };
      }

      neon();
    };

    const neon = () => {
      if (!source) return;

      // Lo-Fi pulse with decay
      currentPulseIntensity.current *= RHYTHM.decay;

      if (random() < RHYTHM.frequency && currentPulseIntensity.current < 0.2) {
        currentPulseIntensity.current = random() * RHYTHM.amplitude;
      }

      const pulseValue = Math.min(
        1.0,
        currentPulseIntensity.current + RHYTHM.base,
      );

      // Color cycling
      const k = (t % T_SWITCH) * f;
      const rgb = {
        r: ~~(wp[csi].r * (1 - k) + wp[(csi + 1) % nwp].r * k),
        g: ~~(wp[csi].g * (1 - k) + wp[(csi + 1) % nwp].g * k),
        b: ~~(wp[csi].b * (1 - k) + wp[(csi + 1) % nwp].b * k),
      };
      const rgb_str = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";

      // Apply pulse
      const finalPulseAmplitude = pulseValue * SETTINGS.pulseAmplitude;
      const stp = 0.5 - 0.5 * finalPulseAmplitude;

      const customRadius = SETTINGS.lightRadiusMultiplier * _min;

      const light = ctx[0].createRadialGradient(
        source.x,
        source.y,
        0,
        source.x,
        source.y,
        customRadius,
      );

      // Adjust transparency based on theme
      const bgAlpha = isDark ? 0 : 255;
      const concentrationString = isDark
        ? `rgba(0,0,0,${SETTINGS.lightConcentration.toFixed(2)})`
        : `rgba(255,255,255,${SETTINGS.lightConcentration.toFixed(2)})`;

      light.addColorStop(0, rgb_str);
      light.addColorStop(stp, concentrationString);

      const fadeOutString = isDark
        ? `rgba(0,0,0,${SETTINGS.persistenceFactor.toFixed(3)})`
        : `rgba(255,255,255,${SETTINGS.persistenceFactor.toFixed(3)})`;

      fillBackground(fadeOutString);
      fillBackground(light);

      t++;

      if (t % T_SWITCH === 0) {
        csi++;
        if (csi === nwp) {
          csi = 0;
          t = 0;
        }
      }

      request_id = requestAnimationFrame(neon);
    };

    const fillBackground = (bg_fill: string | CanvasGradient) => {
      ctx[0].fillStyle = bg_fill;
      ctx[0].beginPath();
      ctx[0].rect(0, 0, w, h);
      ctx[0].closePath();
      ctx[0].fill();
    };

    const handleResize = () => {
      if (request_id) {
        cancelAnimationFrame(request_id);
      }
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
      source = { x: e.clientX, y: e.clientY };
    };

    init();

    window.addEventListener("resize", handleResize, false);
    window.addEventListener("mousemove", handleMouseMove, false);

    return () => {
      if (request_id) {
        cancelAnimationFrame(request_id);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDark]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: isDark ? DARK_BG : LIGHT_BG,
        zIndex: 0,
        transition: "background-color 0.3s ease",
      }}
    >
      <canvas
        ref={canvasLightRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 10,
        }}
      />
      <canvas
        ref={canvasGridRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 20,
        }}
      />
    </div>
  );
}
