"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { Exhibition } from "@/lib/types";

type WorksGridProps = { works: NonNullable<Exhibition["works"]> };

/**
 * Selected works grid with scroll-linked reveal.
 *
 * Each work fades up 16px over 600ms with a 40ms stagger as the container
 * enters the viewport. Fires once (not on re-entry) to avoid "ping-pong"
 * when the user scrolls back up. Respects prefers-reduced-motion.
 */
export function WorksGrid({ works }: WorksGridProps) {
  const reduced = useReducedMotion();

  const itemVariants = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.div
      className="works-listing"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        visible: {
          transition: { staggerChildren: reduced ? 0 : 0.04 },
        },
      }}
    >
      {works.map((work) => (
        <motion.article
          key={work.id}
          className="work-item"
          variants={itemVariants}
        >
          <a
            className="work-item-plate"
            href={`#${work.id}`}
            aria-label={`${work.title}, ${work.number}, view details`}
          >
            <Image
              src={work.image}
              alt={work.alt}
              fill
              sizes="(max-width: 720px) 92vw, (max-width: 960px) 45vw, 30vw"
            />
            <span className="coord-tag">{work.coord}</span>
          </a>
          <div className="work-item-title">
            <em>{work.title}</em>, <span className="year">{work.year}</span>
          </div>
          <div className="work-item-medium">
            {work.number} · {work.edition}
          </div>
          <div className="work-item-actions">
            <a href="#">More views</a>
            <a href="https://verse.works" target="_blank" rel="noopener">
              Inquire
            </a>
          </div>
        </motion.article>
      ))}
    </motion.div>
  );
}
