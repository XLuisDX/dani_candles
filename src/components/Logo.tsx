/* eslint-disable @next/next/no-img-element */
import { LogoProps } from "@/types/types";
import { motion } from "framer-motion";

export function Logo({
  variant = "black",
  width = 120,
  height = 40,
  className = "",
  animated = false,
  onClick,
}: LogoProps) {
  const logoSrc = variant === "white" ? "/logo_white.png" : "/logo_black.png";

  if (animated) {
    return (
      <motion.img
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.05 }}
        src={logoSrc}
        alt="Dani Candles"
        width={width}
        height={height}
        className={className}
        onClick={onClick}
        style={{ width: "auto", height: `${height}px` }}
      />
    );
  }

  return (
    <img
      src={logoSrc}
      alt="Dani Candles"
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      style={{ width: "auto", height: `${height}px` }}
    />
  );
}