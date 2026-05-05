"use client";

import { useEffect, useRef } from "react";

export function PointerAura() {
  const auraRef = useRef(null);
  const coreRef = useRef(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const aura = auraRef.current;
    const core = coreRef.current;
    if (!aura || !core) return undefined;

    const auraSize = 300;
    const coreSize = 16;
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.25;
    let auraX = targetX;
    let auraY = targetY;
    let coreX = targetX;
    let coreY = targetY;
    let visible = false;
    let frameId = 0;

    const render = () => {
      auraX += (targetX - auraX) * 0.12;
      auraY += (targetY - auraY) * 0.12;
      coreX += (targetX - coreX) * 0.22;
      coreY += (targetY - coreY) * 0.22;

      aura.style.transform = `translate3d(${auraX - auraSize / 2}px, ${auraY - auraSize / 2}px, 0)`;
      aura.style.opacity = visible ? "1" : "0";

      core.style.transform = `translate3d(${coreX - coreSize / 2}px, ${coreY - coreSize / 2}px, 0)`;
      core.style.opacity = visible ? "1" : "0";

      frameId = window.requestAnimationFrame(render);
    };

    const handleMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      visible = true;
    };

    const handleLeave = () => {
      visible = false;
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseout", handleLeave);
    frameId = window.requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseout", handleLeave);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      <div ref={auraRef} className="pointer-aura" aria-hidden="true" />
      <div ref={coreRef} className="pointer-aura-core" aria-hidden="true" />
    </>
  );
}
