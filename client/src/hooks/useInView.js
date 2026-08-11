import { useEffect, useRef, useState } from 'react'

/**
 * useInView
 *
 * Returns a [ref, isInView] pair.
 * Once the element enters the viewport it stays "in view" (one-shot trigger),
 * which is the standard scroll-reveal pattern.
 *
 * @param {Object} options  IntersectionObserver options
 * @param {number} options.threshold  0–1, default 0.12
 * @param {string} options.rootMargin default '0px 0px -40px 0px'
 * @param {boolean} options.once      if false, re-triggers on every intersection
 */
export function useInView({
  threshold  = 0.12,
  rootMargin = '0px 0px -40px 0px',
  once       = true,
} = {}) {
  const ref       = useRef(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return [ref, isInView]
}
