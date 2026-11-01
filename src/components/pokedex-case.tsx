"use client";

import { clsx } from "clsx";
import { motion } from "motion/react";
import { ReactNode } from "react";
import { Header } from "./header";

type Props = {
  children: ReactNode;
};

export function PokedexCase({ children }: Props): ReactNode {
  const lightsOn = true;

  return (
    <motion.div
      className={clsx(
        "pokedex bg-pokedex-case relative mx-auto my-1 rounded-4xl",
        lightsOn && "pokedex--lights-on",
      )}
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: [0, 0.5, 1], y: [80, -30, 0] }}
      transition={{
        duration: 0.7,
        times: [0, 0.78, 1],
        ease: [0.2, 0, 0, 1],
      }}
    >
      <Header />
      <div className="under-plate relative z-10 mb-8 grid grid-cols-[1fr_100px] py-8">
        {children}
      </div>
    </motion.div>
  );
}
