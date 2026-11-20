import type { ReactNode } from "react";

/** Dual-line label for .sp-btn / .sp-btn-outline slide animation. */
export default function SpBtnText({ children }: { children: ReactNode }) {
  return (
    <span className="sp-btn-slide">
      <span className="sp-btn-slide__line">{children}</span>
      <span className="sp-btn-slide__line" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}
