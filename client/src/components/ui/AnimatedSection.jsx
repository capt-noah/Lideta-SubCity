import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../../hooks/useInView'

const variants = {
  up:    { hidden: { opacity: 0, y: 28 },       visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -20 },      visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -32 },      visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 32 },       visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.93 }, visible: { opacity: 1, scale: 1 } },
  fade:  { hidden: { opacity: 0 },              visible: { opacity: 1 } },
}

/**
 * AnimatedSection — scroll-triggered reveal using Framer Motion.
 *
 * Props:
 *   variant   — 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade'  (default 'up')
 *   delay     — seconds before animation starts (default 0)
 *   duration  — animation duration in seconds (default 0.6)
 *   className — extra classes on the wrapper div
 *   threshold — IntersectionObserver threshold (default 0.12)
 */
function AnimatedSection({
  children,
  variant   = 'up',
  delay     = 0,
  duration  = 0.6,
  className = '',
  threshold = 0.12,
}) {
  const [ref, isInView] = useInView({ threshold })
  const chosen = variants[variant] ?? variants.up

  return (
    <motion.div
      ref={ref}
      variants={chosen}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedSection
