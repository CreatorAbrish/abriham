import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Premium initial loader: gold ring + script wordmark, then a portal
 * iris-wipe reveal that fades to hand off to the page.
 */
export default function PageLoader() {
  const [phase, setPhase] = useState<"loading" | "opening" | "done">("loading");

  useEffect(() => {
    let open: number;
    const finish = () => {
      setPhase("opening");
      open = window.setTimeout(() => setPhase("done"), 1100);
    };

    if (document.readyState === "complete") {
      const t = window.setTimeout(finish, 900);
      return () => {
        window.clearTimeout(t);
        window.clearTimeout(open);
      };
    }
    const onLoad = () => window.setTimeout(finish, 400);
    window.addEventListener("load", onLoad);
    // Safety fallback
    const safety = window.setTimeout(finish, 3500);
    return () => {
      window.removeEventListener("load", onLoad);
      window.clearTimeout(safety);
      window.clearTimeout(open);
    };
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] overflow-hidden bg-[oklch(0.06_0.005_60)]"
          aria-hidden="true"
        >
          {/* Soft ambient gradients */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.82_0.16_82/0.20),transparent_65%)] blur-2xl" />
            <div className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.55_0.13_155/0.18),transparent_65%)] blur-2xl" />
          </div>

          {/* Center mark */}
          <div className="relative flex h-full w-full items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col items-center gap-6"
            >
              <div className="relative h-24 w-24">
                {/* Spinning gold arc */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, oklch(0.82 0.16 82) 90deg, transparent 220deg)",
                    WebkitMask:
                      "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.6, ease: "linear", repeat: Infinity }}
                />
                {/* Inner pulse */}
                <motion.div
                  className="absolute inset-3 rounded-full border border-white/10 bg-white/[0.02]"
                  animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                />
                {/* Core dot */}
                <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_18px_oklch(0.82_0.16_82)]" />
              </div>

              <div className="text-script text-3xl text-foreground/90">Abriham</div>
              <div className="text-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                Composing the experience
              </div>
            </motion.div>
          </div>

          {/* Portal iris — expands from center, wipes the screen away */}
          <AnimatePresence>
            {phase === "opening" && (
              <motion.div
                key="iris"
                initial={{ clipPath: "circle(0% at 50% 50%)" }}
                animate={{ clipPath: "circle(140% at 50% 50%)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.0, ease: [0.83, 0, 0.17, 1] }}
                className="absolute inset-0 bg-[oklch(0.07_0.005_60)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.82_0.16_82/0.15),transparent_55%)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}