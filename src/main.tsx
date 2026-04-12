import { StrictMode, useLayoutEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.tsx'
import { ScrollTriggerLenisSync } from './components/ScrollTriggerLenisSync.tsx'

function Root() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useLayoutEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const app = (
    <>
      <ScrollTriggerLenisSync />
      <App />
    </>
  )

  if (reducedMotion) {
    return <StrictMode>{app}</StrictMode>
  }

  return (
    <StrictMode>
      <ReactLenis
        root
        options={{
          autoRaf: false,
          lerp: 0.09,
          wheelMultiplier: 1,
          touchMultiplier: 1.1,
          smoothWheel: true,
        }}
      >
        {app}
      </ReactLenis>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')!).render(<Root />)
