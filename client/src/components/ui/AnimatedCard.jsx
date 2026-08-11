import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../../hooks/useInView'

/**
 * AnimatedCard — staggered scroll-triggered entrance for card grids.
 *
 * Props:
 *   index    — card's 0-based position; drives the stagger delay
 *   stagger  — ms added per index (default 80)
 *   maxDelay — cap on total delay in ms (default 640)
 *   variant  — 'up' | 'scale'  (default 'up')
 *   duration — animation duration in seconds (default 0.55)
 *   className — extra wrapper classes
 */
function AnimatedCard({
  children,
  index    = 0,
  stagger  = 80,
  maxDelay = 640,
  variant  = 'up',
  duration = 0.55,
  className = '',
}) {
  const [ref, isInView] = useInView({ threshold: 0.08 })
  const delaySec = Math.min(index * stagger, maxDelay) / 1000

  const variants = {
    up:    { hidden: { opacity: 0, y: 24 },       visible: { opacity: 1, y: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.93 }, visible: { opacity: 1, scale: 1 } },
  }
  const chosen = variants[variant] ?? variants.up

  return (
    <motion.div
      ref={ref}
      variants={chosen}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration, delay: delaySec, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedCard
