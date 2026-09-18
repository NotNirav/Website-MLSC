/* FluidGlass Mount Script
 * Mounts FluidGlass into #fluid-glass-root, binding the 3D lens directly to the MLSC text.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import FluidGlass from './FluidGlass.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[FluidGlass] React error boundary caught:', error);
    console.error('[FluidGlass] Component stack:', info?.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return React.createElement(
        'div',
        {
          style: {
            color: '#ff6b6b',
            padding: '20px',
            fontSize: '13px',
            fontFamily: 'monospace',
            zIndex: 9999,
            position: 'relative'
          }
        },
        'FluidGlass Error: ' + (this.state.error?.message || 'Unknown error')
      );
    }
    return this.props.children;
  }
}

function mount() {
  const container = document.getElementById('fluid-glass-root');
  const aboutBox = document.getElementById('about-glass-box');

  if (!container) {
    console.error('[FluidGlass] #fluid-glass-root not found!');
    return;
  }

  // Extract the user's exact text from DOM if present, or use standard MLSC copy
  let mainText = '';
  let highlightText = '';

  const aboutTextEl = aboutBox ? aboutBox.querySelector('.about-text') : null;
  const aboutHighlightEl = aboutBox ? aboutBox.querySelector('.about-highlight') : null;

  if (aboutTextEl) {
    // Convert multiple whitespace/newlines to clean readable paragraph text
    mainText = aboutTextEl.innerText.replace(/\s+/g, ' ').trim();
  } else {
    mainText =
      'Microsoft Learn Student Chapter PCCOE is a student driven tech community where curiosity meets creativity and ideas turn into real-world experiences. We bring students together to explore emerging technologies, learn beyond the classroom, and grow through collaboration. From hands-on learning and technical sessions to flagship events like BlueBit, TechRoom, and Praxis, we create opportunities to experiment, build, share knowledge, and connect with like-minded innovators. Our community is driven by a simple belief , "Technology is best learned when it is explored together".';
  }

  if (aboutHighlightEl) {
    highlightText = aboutHighlightEl.innerText.replace(/\s+/g, ' ').trim();
  } else {
    highlightText = 'A space to learn, create, collaborate, and make an impact.';
  }

  try {
    const root = createRoot(container);
    root.render(
      React.createElement(
        ErrorBoundary,
        null,
        React.createElement(FluidGlass, {
          mode: 'lens',
          mainText,
          highlightText,
          textColor: '#f3f4f6',
          highlightColor: '#7dd3fc',
          backgroundColor: 'transparent',
          lensProps: {
            scale: 0.3,
            ior: 1.15,
            thickness: 3.0,
            chromaticAberration: 0.02,
            anisotropy: 0,
            roughness: 0,
            transmission: 1,
            color: '#ffffff',
            attenuationColor: '#ffffff'
          }
        })
      )
    );

    if (aboutBox) {
      aboutBox.classList.add('has-fluid-glass');
    }

    console.log('[FluidGlass] Mounted with MLSC text successfully');
  } catch (err) {
    console.error('[FluidGlass] Mount error:', err);
    if (aboutBox) {
      aboutBox.classList.remove('has-fluid-glass');
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
