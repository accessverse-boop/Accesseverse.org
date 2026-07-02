import React, { useState, useEffect } from 'react';
import { ACCESS_VERSE } from '@/constants/testIds';
import { 
  Settings, 
  X, 
  Sun, 
  Moon, 
  Type, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Eye, 
  RotateCcw,
  Check
} from 'lucide-react';

export default function FloatingAccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [contrast, setContrast] = useState('normal'); // 'normal', 'high', 'dark'
  const [fontScale, setFontScale] = useState(100); // 100%, 110%, 120%, 130%
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [outlineFocus, setOutlineFocus] = useState(false);
  const [screenReaderSim, setScreenReaderSim] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [spokenText, setSpokenText] = useState('');

  // Apply Font Scale
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale}%`;
  }, [fontScale]);

  // Apply Contrast Theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'high-contrast');
    
    if (contrast === 'dark') {
      root.classList.add('dark');
    } else if (contrast === 'high') {
      root.classList.add('high-contrast');
      // Set high contrast CSS variables if needed
    }
  }, [contrast]);

  // Apply Dyslexia Font
  useEffect(() => {
    if (dyslexiaFont) {
      document.body.classList.add('dyslexic-font');
    } else {
      document.body.classList.remove('dyslexic-font');
    }
  }, [dyslexiaFont]);

  // Apply Visual Outline Focus Indicator
  useEffect(() => {
    if (outlineFocus) {
      document.body.classList.add('outline-focus-active');
    } else {
      document.body.classList.remove('outline-focus-active');
    }
  }, [outlineFocus]);

  // Handle Screen Reader Simulator
  useEffect(() => {
    if (!screenReaderSim) {
      setSpokenText('');
      return;
    }

    const speak = (text) => {
      if (!text) return;
      setSpokenText(text);
      if (!isMuted && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    };

    const handleFocus = (e) => {
      const el = e.target;
      const label = el.getAttribute('aria-label') || el.innerText || el.placeholder || el.alt || '';
      const role = el.getAttribute('role') || el.tagName.toLowerCase();
      if (label && label.trim().length > 0) {
        speak(`${role}: ${label.trim().substring(0, 100)}`);
      }
    };

    const handleMouseOver = (e) => {
      // Find the closest text containing or labelled element
      const el = e.target.closest('button, a, h1, h2, h3, p, label, input, img');
      if (el) {
        const label = el.getAttribute('aria-label') || el.innerText || el.placeholder || el.alt || '';
        const role = el.getAttribute('role') || el.tagName.toLowerCase();
        if (label && label.trim().length > 0) {
          // Avoid double trigger
          if (window.__lastSpoken !== label) {
            window.__lastSpoken = label;
            speak(`${role}: ${label.trim().substring(0, 100)}`);
          }
        }
      }
    };

    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('mouseover', handleMouseOver, true);

    return () => {
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('mouseover', handleMouseOver, true);
    };
  }, [screenReaderSim, isMuted]);

  const resetAll = () => {
    setContrast('normal');
    setFontScale(100);
    setDyslexiaFont(false);
    setOutlineFocus(false);
    setScreenReaderSim(false);
    setIsMuted(true);
    setSpokenText('');
  };

  return (
    <>
      {/* CSS injection for high contrast and dyslexia font */}
      <style>{`
        /* High Contrast Theme */
        .high-contrast {
          --background: 0 0% 0% !important;
          --foreground: 60 100% 50% !important; /* Yellow text */
          --card: 0 0% 0% !important;
          --card-foreground: 60 100% 50% !important;
          --primary: 60 100% 50% !important;
          --primary-foreground: 0 0% 0% !important;
          --secondary: 0 0% 10% !important;
          --secondary-foreground: 60 100% 50% !important;
          --muted: 0 0% 15% !important;
          --muted-foreground: 60 100% 50% !important;
          --border: 60 100% 50% !important;
          --input: 60 100% 50% !important;
          background-color: #000000 !important;
          color: #FFFF00 !important;
        }
        .high-contrast * {
          border-color: #FFFF00 !important;
          background-color: transparent !important;
          color: #FFFF00 !important;
          text-shadow: none !important;
          box-shadow: none !important;
        }
        .high-contrast button, .high-contrast a {
          outline: 2px solid #FFFF00 !important;
          outline-offset: 2px !important;
        }

        /* Dyslexic Font style */
        .dyslexic-font, .dyslexic-font * {
          font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive, sans-serif !important;
        }

        /* Outline Focus Mode */
        .outline-focus-active *:focus-visible {
          outline: 4px solid #0066FF !important;
          outline-offset: 4px !important;
          box-shadow: 0 0 0 8px rgba(0, 102, 255, 0.2) !important;
        }
      `}</style>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        data-testid={ACCESS_VERSE.floatingA11yPanelToggle}
        aria-label="Toggle Accessibility Panel"
        className="fixed bottom-24 left-6 z-50 flex h-14 width-14 w-14 items-center justify-center rounded-full bg-[#0066FF] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Settings className="h-6 w-6 animate-spin-slow" />}
      </button>

      {/* Panel */}
      {isOpen && (
        <div 
          role="dialog"
          aria-label="Accessibility Assistant"
          className="fixed bottom-40 left-6 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl transition-all dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-900">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-[#0066FF]" />
              <h2 className="text-base font-semibold text-[#0B192C] dark:text-white">A11y Assistant</h2>
            </div>
            <button 
              onClick={resetAll}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-[#0066FF] dark:text-slate-400"
              title="Reset helper settings"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          <div className="space-y-5">
            {/* Contrast Theme */}
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-2">Contrast Mode</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setContrast('normal')}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2 text-xs font-medium transition ${
                    contrast === 'normal' 
                      ? 'border-[#0066FF] bg-blue-50/50 text-[#0066FF] dark:bg-blue-950/20' 
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                  }`}
                >
                  <Sun className="h-4 w-4 mb-1" />
                  Default
                </button>
                <button
                  onClick={() => setContrast('dark')}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2 text-xs font-medium transition ${
                    contrast === 'dark' 
                      ? 'border-[#0066FF] bg-blue-50/50 text-[#0066FF] dark:bg-blue-950/20' 
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                  }`}
                >
                  <Moon className="h-4 w-4 mb-1" />
                  Dark
                </button>
                <button
                  onClick={() => setContrast('high')}
                  data-testid={ACCESS_VERSE.a11yContrastToggle}
                  className={`flex flex-col items-center justify-center rounded-lg border p-2 text-xs font-medium transition ${
                    contrast === 'high' 
                      ? 'border-yellow-400 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' 
                      : 'border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className="font-bold text-sm mb-1 leading-none">A+</span>
                  Hi-Contrast
                </button>
              </div>
            </div>

            {/* Font Sizing */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Font Scale</label>
                <span className="text-xs font-semibold text-[#0066FF]">{fontScale}%</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setFontScale(Math.max(90, fontScale - 10))}
                  data-testid={ACCESS_VERSE.a11yTextDecrease}
                  className="flex-1 rounded-lg border border-slate-200 p-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontScale(100)}
                  data-testid={ACCESS_VERSE.a11yTextReset}
                  className="flex-1 rounded-lg border border-slate-200 p-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  Reset
                </button>
                <button
                  onClick={() => setFontScale(Math.min(150, fontScale + 10))}
                  data-testid={ACCESS_VERSE.a11yTextIncrease}
                  className="flex-1 rounded-lg border border-slate-200 p-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Extras */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-900">
              {/* Dyslexia font toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Dyslexia Font</span>
                </div>
                <button
                  onClick={() => setDyslexiaFont(!dyslexiaFont)}
                  data-testid={ACCESS_VERSE.a11yDyslexiaToggle}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                    dyslexiaFont ? 'bg-[#0066FF]' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    dyslexiaFont ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Keyboard visual focus helper */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Highlight Focus</span>
                </div>
                <button
                  onClick={() => setOutlineFocus(!outlineFocus)}
                  data-testid={ACCESS_VERSE.a11yOutlineFocusToggle}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                    outlineFocus ? 'bg-[#0066FF]' : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    outlineFocus ? 'translate-x-5' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {/* Screen Reader Simulator */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isMuted ? <VolumeX className="h-4 w-4 text-slate-400" /> : <Volume2 className="h-4 w-4 text-slate-400" />}
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Speech Simulator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`rounded p-1 ${isMuted ? 'text-slate-400' : 'text-[#0066FF] bg-blue-50 dark:bg-blue-950/20'}`}
                    title={isMuted ? "Unmute Voice" : "Mute Voice"}
                    disabled={!screenReaderSim}
                  >
                    {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => setScreenReaderSim(!screenReaderSim)}
                    data-testid={ACCESS_VERSE.a11yScreenReaderToggle}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                      screenReaderSim ? 'bg-[#0066FF]' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      screenReaderSim ? 'translate-x-5' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Screen Reader Captions HUD */}
          {screenReaderSim && (
            <div className="mt-4 rounded-lg bg-slate-900 p-2.5 text-left text-[11px] font-mono text-slate-200 border border-slate-800">
              <div className="flex items-center justify-between text-[10px] uppercase text-slate-400 font-semibold mb-1">
                <span>Screen Reader Output</span>
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="line-clamp-2 italic leading-relaxed">
                {spokenText || 'Hover or tab onto any element to simulate speech...'}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
