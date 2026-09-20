'use client'

import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Maximize, Minimize, Pause, Play, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MlscLogo } from '@/components/mlsc-logo'
import { TheaterScene } from '@/components/theater-scene'
import { useCinematicReveal } from '@/hooks/use-cinematic-reveal'

const chapters = ['The spark', 'The possibility', 'The next chapter']

export function CinematicExperience() {
  const { containerRef, stageRef, phase, paused, replayKey, ready, goTo, replay, togglePaused } = useCinematicReveal()
  const [fullscreen, setFullscreen] = useState(false)
  const [fullscreenSupported, setFullscreenSupported] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setFullscreenSupported(Boolean(document.fullscreenEnabled))
    const update = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', update)
    return () => document.removeEventListener('fullscreenchange', update)
  }, [])

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
      setNotice('')
    } catch {
      setNotice('Fullscreen is unavailable in this preview. Open the site in its own tab to use fullscreen.')
    }
  }

  return (
    <main ref={containerRef} className="cinema-runway" id="experience">
      <div
        ref={stageRef}
        className="cinema-experience"
        data-phase={phase}
        data-paused={paused}
        data-ready={ready}
      >
        <TheaterScene replayKey={replayKey} />
        <div className="chapter-background" aria-hidden="true" />

        <header className="experience-header">
          <a href="#experience" className="chapter-brand" aria-label="MLSC PCCoE — replay the experience" onClick={(event) => { event.preventDefault(); replay() }}>
            <span className="header-logo">
              <MlscLogo light className="header-logo-light" />
              <MlscLogo className="header-logo-dark" />
            </span>
            <span className="brand-divider" />
            <span className="brand-caption">Microsoft Learn<br />Student Chapter</span>
          </a>
          <div className="header-right">
            <span className="chapter-location"><span className="location-dot" /> PCCOE, PUNE</span>
            <Button variant="cinema-quiet" onClick={() => phase === 2 ? replay() : goTo(1, 700)} aria-label={phase === 2 ? 'Replay intro' : 'Skip to the logo reveal'}>
              {phase === 2 ? 'Replay intro' : 'Skip intro'}
              <ArrowUpRight data-icon="inline-end" />
            </Button>
          </div>
        </header>

        <div className="scene-eyebrow" aria-hidden={phase !== 0}>
          <span className="eyebrow-line" />
          A NEW CHAPTER IS COMING TO LIGHT
          <span className="eyebrow-line" />
        </div>

        <section className="intro-copy" aria-hidden={phase !== 0} inert={phase !== 0}>
          <p className="intro-kicker">Curiosity brings us together.</p>
          <h1>This is where it begins.</h1>
          <Button variant="cinema" size="cinema" onClick={() => goTo(1)}>
            Enter the experience
            <ArrowRight data-icon="inline-end" />
          </Button>
        </section>

        <section className="chapter-content" aria-hidden={phase !== 2} inert={phase !== 2}>
          <p className="chapter-eyebrow">MICROSOFT LEARN STUDENT CHAPTER</p>
          <MlscLogo className="chapter-hero-logo" />
          <span className="chapter-rule" aria-hidden="true" />
          <h2>Breaking norms.<br /><span>Setting standards.</span></h2>
          <p className="chapter-description">A community of curious minds, building what comes next.<br className="desktop-break" /> Learn together. Create boldly. Make your mark.</p>
          <p className="chapter-college">Pimpri Chinchwad College of Engineering</p>
          <Button variant="cinema-outline" size="cinema" onClick={replay}>
            Experience it again
            <RotateCcw data-icon="inline-end" />
          </Button>
        </section>

        <footer className="experience-footer">
          <div className="chapter-indicator" aria-label={`Chapter ${phase + 1} of 3: ${chapters[phase]}`}>
            <span className="chapter-number">0{phase + 1}<span> / 03</span></span>
            <span className="indicator-divider" />
            <span className="chapter-label">{chapters[phase]}</span>
          </div>
          <button className="scroll-cue" onClick={() => phase === 2 ? replay() : goTo(1)} aria-label={phase === 2 ? 'Return to the beginning' : 'Play the scroll-driven reveal'}>
            <span>{phase === 2 ? 'BACK TO THE BEGINNING' : 'SCROLL TO REVEAL'}</span>
            {phase === 2 ? <RotateCcw aria-hidden="true" /> : <ArrowDown aria-hidden="true" />}
          </button>
          <div className="experience-controls" aria-label="Animation controls">
            <Button variant="cinema-control" size="cinema-icon" onClick={togglePaused} aria-label={paused ? 'Resume animation' : 'Pause animation'} aria-pressed={paused} title={paused ? 'Resume animation' : 'Pause animation'}>
              {paused ? <Play /> : <Pause />}
            </Button>
            <Button variant="cinema-control" size="cinema-icon" onClick={replay} aria-label="Replay logo animation" title="Replay logo animation">
              <RotateCcw />
            </Button>
            {fullscreenSupported && (
              <Button variant="cinema-control" size="cinema-icon" onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} title={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                {fullscreen ? <Minimize /> : <Maximize />}
              </Button>
            )}
          </div>
        </footer>
        <div className="experience-progress" aria-hidden="true"><span /></div>
        <p className="experience-notice" role="status">{notice}</p>
      </div>
    </main>
  )
}
