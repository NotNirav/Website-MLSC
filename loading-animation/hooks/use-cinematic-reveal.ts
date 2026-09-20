'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const segment = (value: number, start: number, end: number) => clamp((value - start) / (end - start))
const ease = (value: number) => value * value * (3 - 2 * value)

export function useCinematicReveal() {
  const containerRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const autoFrameRef = useRef(0)
  const currentRef = useRef(0)
  const phaseRef = useRef(0)
  const pausedRef = useRef(false)
  const reducedMotionRef = useRef(false)
  const [phase, setPhase] = useState(0)
  const [paused, setPaused] = useState(false)
  const [replayKey, setReplayKey] = useState(0)
  const [ready, setReady] = useState(false)

  const stopAutoScroll = useCallback(() => {
    cancelAnimationFrame(autoFrameRef.current)
    autoFrameRef.current = 0
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const stage = stageRef.current
    if (!container || !stage) return

    let frame = 0
    let target = 0
    let lastFrame = 0
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = media.matches

    const draw = (time: number) => {
      const delta = lastFrame ? Math.min(time - lastFrame, 50) : 16.67
      lastFrame = time
      const mix = reducedMotionRef.current ? 1 : 1 - Math.exp(-delta / 85)
      const next = currentRef.current + (target - currentRef.current) * mix
      const progress = Math.abs(target - next) < 0.0001 ? target : next
      currentRef.current = progress
      const push = ease(segment(progress, 0.08, 0.82))
      const end = ease(segment(progress, 0.7, 0.93))

      stage.style.setProperty('--room-scale', String(reducedMotionRef.current ? 1 : 1 + push * 3.2))
      stage.style.setProperty('--screen-light', String(ease(segment(progress, 0.08, 0.57))))
      stage.style.setProperty('--logo-opacity', String(1 - segment(progress, 0.12, 0.43)))
      stage.style.setProperty('--intro-opacity', String(1 - segment(progress, 0, 0.2)))
      stage.style.setProperty('--room-opacity', String(1 - end))
      stage.style.setProperty('--chapter-opacity', String(end))
      stage.style.setProperty('--chapter-offset', `${(1 - end) * 32}px`)
      stage.style.setProperty('--progress', String(progress))

      const nextPhase = progress > 0.8 ? 2 : progress > 0.2 ? 1 : 0
      if (nextPhase !== phaseRef.current) {
        phaseRef.current = nextPhase
        setPhase(nextPhase)
      }
      frame = progress !== target ? requestAnimationFrame(draw) : 0
    }

    const update = () => {
      const distance = Math.max(1, container.offsetHeight - window.innerHeight)
      target = clamp((window.scrollY - container.offsetTop) / distance)
      if (!frame) {
        lastFrame = 0
        frame = requestAnimationFrame(draw)
      }
    }
    const motionChanged = () => {
      reducedMotionRef.current = media.matches
      update()
    }
    const interrupt = (event: KeyboardEvent) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) stopAutoScroll()
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    window.addEventListener('wheel', stopAutoScroll, { passive: true })
    window.addEventListener('touchstart', stopAutoScroll, { passive: true })
    window.addEventListener('keydown', interrupt)
    media.addEventListener('change', motionChanged)
    update()
    setReady(true)

    return () => {
      cancelAnimationFrame(frame)
      stopAutoScroll()
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('wheel', stopAutoScroll)
      window.removeEventListener('touchstart', stopAutoScroll)
      window.removeEventListener('keydown', interrupt)
      media.removeEventListener('change', motionChanged)
    }
  }, [stopAutoScroll])

  const goTo = useCallback((destination: number, duration = 2800) => {
    const container = containerRef.current
    if (!container) return
    stopAutoScroll()
    const from = window.scrollY
    const to = container.offsetTop + (container.offsetHeight - window.innerHeight) * destination
    if (reducedMotionRef.current || duration === 0) {
      window.scrollTo({ top: to, behavior: 'instant' })
      return
    }
    pausedRef.current = false
    setPaused(false)
    let elapsed = 0
    let lastTime = 0
    const move = (time: number) => {
      if (lastTime && !pausedRef.current) elapsed += Math.min(time - lastTime, 50)
      lastTime = time
      const progress = clamp(elapsed / duration)
      window.scrollTo({ top: from + (to - from) * ease(progress), behavior: 'instant' })
      if (progress < 1) autoFrameRef.current = requestAnimationFrame(move)
      else autoFrameRef.current = 0
    }
    autoFrameRef.current = requestAnimationFrame(move)
  }, [stopAutoScroll])

  const replay = useCallback(() => {
    goTo(0, 0)
    pausedRef.current = false
    setPaused(false)
    setReplayKey((key) => key + 1)
  }, [goTo])

  const togglePaused = useCallback(() => {
    pausedRef.current = !pausedRef.current
    setPaused(pausedRef.current)
  }, [])

  return { containerRef, stageRef, phase, paused, replayKey, ready, goTo, replay, togglePaused }
}
