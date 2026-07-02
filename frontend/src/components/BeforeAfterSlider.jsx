import React, { useState, useRef, useEffect } from 'react';
import { ACCESS_VERSE } from '@/constants/testIds';
import { AlertTriangle, CheckCircle2, ArrowLeftRight, Code, Eye } from 'lucide-react';

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    
    if (isDragging) {
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
    }
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDragging]);

  const rawPdfStructure = [
    { type: 'header', text: 'ANNUAL FINANCIAL COMPLIANCE REPORT', bad: 'Heading size 24px (No tag)', good: '<H1> Annual Financial Compliance Report' },
    { type: 'paragraph', text: 'In fiscal year 2025, our organization experienced growth across major domains.', bad: 'Text Block (No Reading Order)', good: '<P> In fiscal year 2025, our organization...' },
    { type: 'table', text: 'Revenue | $24.5M | +12%', bad: 'Plain grid without headers', good: '<Table> with <TH> Headers and scope="col"' },
    { type: 'image', text: 'Sales Growth Chart', bad: 'Image (No alternate text / alt-tag)', good: '<Figure alt="Chart showing 12% revenue growth">' },
  ];

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-[#0B192C] dark:text-white flex items-center gap-2">
            <Code className="h-5 w-5 text-[#0066FF]" />
            PDF Structure Tagging Comparison
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Drag the slider to compare standard unstructured layouts vs. our fully accessible WCAG 2.2 / PDF/UA compliant structures.
          </p>
        </div>
        <div className="flex gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-3.5 w-3.5" /> Untagged PDF
          </span>
          <span className="flex items-center gap-1.5 text-[#10B981]">
            <CheckCircle2 className="h-3.5 w-3.5" /> Remediation Standard
          </span>
        </div>
      </div>

      {/* Main Draggable Container */}
      <div 
        ref={containerRef}
        className="relative h-[480px] w-full select-none overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-md dark:border-slate-800 dark:bg-slate-900"
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
      >
        {/* Untagged / BAD PDF View (Always Background) */}
        <div className="absolute inset-0 h-full w-full p-8 md:p-12 flex flex-col justify-between">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Unremediated Document
            </span>
            <span className="text-xs font-mono text-slate-400">Page 1 of 1</span>
          </div>

          <div className="flex-1 space-y-6 mt-6">
            {/* Header Block (Bad) */}
            <div className="rounded-lg border border-dashed border-red-300 bg-red-50/50 p-4 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">[Flat Text Block - Screen Reader: Skipping Heading Structure]</span>
              </div>
              <p className="text-2xl font-bold text-[#0B192C] opacity-35">
                {rawPdfStructure[0].text}
              </p>
            </div>

            {/* Paragraph Block (Bad) */}
            <div className="rounded-lg border border-dashed border-red-300 bg-red-50/50 p-4 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">[No logical order - Reads out of context]</span>
              </div>
              <p className="text-sm text-[#0B192C] opacity-35 leading-relaxed">
                {rawPdfStructure[1].text}
              </p>
            </div>

            {/* Table / Layout Block (Bad) */}
            <div className="rounded-lg border border-dashed border-red-300 bg-red-50/50 p-4 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">[No Table Tags - Reads as flat unstructured lines]</span>
              </div>
              <div className="text-xs font-mono text-[#0B192C] opacity-35 bg-white p-3 rounded border">
                {rawPdfStructure[2].text}
              </div>
            </div>

            {/* Image Block (Bad) */}
            <div className="rounded-lg border border-dashed border-red-300 bg-red-50/50 p-4 transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest">[Graphic - Empty Alt Tag: Entirely silent on Screen Readers]</span>
              </div>
              <div className="h-12 flex items-center justify-center bg-[#0B192C]/5 rounded border">
                <span className="text-xs text-[#0B192C] font-semibold opacity-30">{rawPdfStructure[3].text}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tagged / GOOD PDF View (Clip / Overlay) */}
        <div 
          className="absolute inset-0 h-full overflow-hidden p-8 md:p-12 flex flex-col justify-between bg-white dark:bg-slate-950 transition-shadow pointer-events-none"
          style={{ width: `${sliderPosition}%` }}
        >
          {/* Prevent container shrinking content inside clipped overlay */}
          <div className="h-full flex flex-col justify-between" style={{ width: containerRef.current?.getBoundingClientRect().width || 600, paddingRight: '2rem' }}>
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> Fully Remediated PDF/UA
              </span>
              <span className="text-xs font-mono text-slate-400">Page 1 of 1</span>
            </div>

            <div className="flex-1 space-y-6 mt-6">
              {/* Header Block (Good) */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/20 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                    <span className="bg-emerald-500 text-white rounded-full h-3 w-3 inline-flex items-center justify-center text-[8px]">1</span>
                    Tag: &lt;H1&gt; (Heading level 1)
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-[#0B192C] dark:text-white leading-tight">
                  {rawPdfStructure[0].text}
                </h1>
              </div>

              {/* Paragraph Block (Good) */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/20 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                    <span className="bg-emerald-500 text-white rounded-full h-3 w-3 inline-flex items-center justify-center text-[8px]">2</span>
                    Tag: &lt;P&gt; (Paragraph / Logical Reading Order)
                  </span>
                </div>
                <p className="text-sm text-[#0B192C]/80 dark:text-slate-300 leading-relaxed">
                  {rawPdfStructure[1].text}
                </p>
              </div>

              {/* Table / Layout Block (Good) */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/20 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                    <span className="bg-emerald-500 text-white rounded-full h-3 w-3 inline-flex items-center justify-center text-[8px]">3</span>
                    Tag: &lt;Table&gt; with proper &lt;TR&gt;, &lt;TH&gt;
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-xs text-[#0B192C] dark:text-white font-semibold text-center bg-slate-50 dark:bg-slate-900 p-2.5 rounded border border-emerald-100">
                  <div className="bg-emerald-500/10 p-1 border border-emerald-200 rounded">Metric</div>
                  <div className="bg-emerald-500/10 p-1 border border-emerald-200 rounded">Value</div>
                  <div className="bg-emerald-500/10 p-1 border border-emerald-200 rounded">Change</div>
                  <div className="p-1 font-normal opacity-80">Revenue</div>
                  <div className="p-1 font-normal opacity-80">$24.5M</div>
                  <div className="p-1 font-normal text-emerald-600 font-bold">+12%</div>
                </div>
              </div>

              {/* Image Block (Good) */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/20 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                    <span className="bg-emerald-500 text-white rounded-full h-3 w-3 inline-flex items-center justify-center text-[8px]">4</span>
                    Tag: &lt;Figure&gt; Alt-Text Assigned
                  </span>
                </div>
                <div className="h-12 flex items-center justify-between bg-slate-50 dark:bg-slate-900 px-4 rounded border border-emerald-100">
                  <span className="text-xs text-[#0B192C]/80 dark:text-slate-300 font-medium">📊 [Chart Graphic]</span>
                  <span className="text-[11px] font-mono text-emerald-600 font-bold bg-white dark:bg-slate-950 px-2.5 py-0.5 rounded border border-emerald-200">
                    alt=&quot;Chart showing 12% revenue growth in FY25&quot;
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drag Handle Bar */}
        <div 
          className="absolute top-0 bottom-0 z-10 w-1 cursor-ew-resize bg-[#0066FF]"
          style={{ left: `${sliderPosition}%` }}
        >
          <div 
            data-testid={ACCESS_VERSE.sliderHandle}
            aria-label="Drag slider to compare"
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[#0066FF] text-white shadow-xl hover:scale-110 active:scale-95 transition-transform"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
