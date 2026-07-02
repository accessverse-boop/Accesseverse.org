import React from 'react';
import { ACCESS_VERSE } from '@/constants/testIds';
import { Sparkles, Type, Paintbrush, Layout, ShieldCheck, Check, Info } from 'lucide-react';

export default function DesignSystemView() {
  const colorPalette = [
    { name: 'Background', hex: '#FFFFFF', desc: 'Primary document base', text: 'text-[#0B192C]', bg: 'bg-white border' },
    { name: 'Section Background', hex: '#F8F9FA', desc: 'Calm block separation', text: 'text-[#0B192C]', bg: 'bg-[#F8F9FA] border' },
    { name: 'Text / Dark Navy', hex: '#0B192C', desc: 'Premium editorial body', text: 'text-white', bg: 'bg-[#0B192C]' },
    { name: 'Accent / Modern Blue', hex: '#0066FF', desc: 'Primary interactive triggers', text: 'text-white', bg: 'bg-[#0066FF]' },
    { name: 'Secondary / Soft Cyan', hex: '#00B4D8', desc: 'Focus highlight accents', text: 'text-white', bg: 'bg-[#00B4D8]' },
    { name: 'Success / Emerald', hex: '#10B981', desc: 'Verification & remediated status', text: 'text-white', bg: 'bg-[#10B981]' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12 bg-white dark:bg-slate-950 min-h-screen">
      {/* Introduction */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-8 text-left">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#0066FF] flex items-center gap-1">
          <Sparkles className="h-4 w-4" />
          AccessVerse Brand Identity
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B192C] dark:text-white mt-2 tracking-tighter">
          Design System &amp; UI Kit
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl text-base leading-relaxed">
          Our design language takes heavy inspiration from industry leaders like Apple, Stripe, and Linear. 
          Minimal, high-contrast, accessibility-first layout designed to represent absolute trust.
        </p>
      </div>

      {/* Typography Section */}
      <section className="space-y-6 text-left">
        <h2 className="text-2xl font-bold text-[#0B192C] dark:text-white tracking-tight flex items-center gap-2">
          <Type className="h-5 w-5 text-[#0066FF]" />
          1. Typography (Inter)
        </h2>
        <p className="text-sm text-slate-500 max-w-xl">
          Clean, legible, and highly scalable. We use tight tracking on headings to achieve a crisp, premium look.
        </p>

        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 bg-slate-50/50 dark:bg-slate-900/20 space-y-6">
          <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-2">H1 (Main Heading) — text-4xl sm:text-5xl lg:text-6xl tracking-tighter font-extrabold</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B192C] dark:text-white tracking-tighter">
              Making Digital Content Accessible for Everyone.
            </h1>
          </div>

          <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-2">H2 (Section Subheading) — text-3xl sm:text-4xl tracking-tight font-bold</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0B192C] dark:text-white tracking-tight">
              Achieve perfect compliance without rewriting your core backend.
            </h2>
          </div>

          <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-2">H3 (Sub Card Heading) — text-xl sm:text-2xl font-semibold</span>
            <h3 className="text-xl sm:text-2xl font-semibold text-[#0B192C] dark:text-white">
              PDF Accessibility Remediation
            </h3>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-400 block mb-2">Body (Regular text) — text-base leading-relaxed</span>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              Our automated analysis pipelines dissect document headers, tables, images, and visual components to superimpose 
              semantic tagging coordinates. Fully compatible with modern JAWS, NVDA, and VoiceOver screen readers, establishing standard-certified PDF/UA outputs.
            </p>
          </div>
        </div>
      </section>

      {/* Colors Section */}
      <section className="space-y-6 text-left">
        <h2 className="text-2xl font-bold text-[#0B192C] dark:text-white tracking-tight flex items-center gap-2">
          <Paintbrush className="h-5 w-5 text-[#0066FF]" />
          2. Color Palette &amp; Contrast
        </h2>
        <p className="text-sm text-slate-500 max-w-xl">
          A high-contrast calm scheme ensuring perfect WCAG 2.2 AA (4.5:1 ratio) contrast thresholds out of the box.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {colorPalette.map((color) => (
            <div 
              key={color.name}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-sm"
            >
              <div className={`h-24 ${color.bg} flex items-end p-3 ${color.text}`}>
                <span className="font-mono text-xs font-bold">{color.hex}</span>
              </div>
              <div className="p-3.5 space-y-1">
                <p className="text-xs font-bold text-[#0B192C] dark:text-white">{color.name}</p>
                <p className="text-[10px] text-slate-400 leading-snug">{color.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Elements Section */}
      <section className="space-y-6 text-left">
        <h2 className="text-2xl font-bold text-[#0B192C] dark:text-white tracking-tight flex items-center gap-2">
          <Layout className="h-5 w-5 text-[#0066FF]" />
          3. Interactive UI Elements
        </h2>
        <p className="text-sm text-slate-500 max-w-xl">
          Clean, rounded-xl boundaries with soft focus state shadows and interactive scale micro-animations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 bg-slate-50/50 dark:bg-slate-900/20">
          {/* Buttons */}
          <div className="space-y-4">
            <span className="text-xs font-semibold tracking-wider text-slate-400 block uppercase">Buttons &amp; Actions</span>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-xl bg-[#0066FF] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 hover:-translate-y-0.5 transition duration-200">
                Primary Button
              </button>
              <button className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-[#0B192C] shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 transition duration-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900">
                Secondary Button
              </button>
              <button className="rounded-xl bg-[#10B981] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-600 transition duration-200">
                Success Action
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Micro-animations apply a subtle <code>translate-y</code> lift with soft timing transitions.
            </p>
          </div>

          {/* Cards & Borders */}
          <div className="space-y-4">
            <span className="text-xs font-semibold tracking-wider text-slate-400 block uppercase">Borders &amp; Shadows</span>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:border-slate-800 dark:bg-slate-900">
              <h4 className="text-sm font-bold text-[#0B192C] dark:text-white">Premium Card Aspect</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Thin borders (1px) combined with an ultra-light gray outer layout shadow. Soft, modern, and readable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Guarantee Section */}
      <section className="space-y-6 text-left border-t border-slate-200 dark:border-slate-800 pt-8">
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
          <div className="rounded-full bg-emerald-500/20 p-3 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0B192C] dark:text-white tracking-tight flex items-center gap-2">
              WCAG 2.2 AA &amp; PDF/UA Standard Compliant
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
              Our site architecture guarantees semantic markup validation, full screen reader support, keyboard path logical tab-indexes, 
              focus state highlight rings, high contrast visual boundaries, and responsive viewport support up to 200% text-scale ratios.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Logical Tab Order</span>
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> High Contrast Ratio</span>
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Aria attributes</span>
              <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Semantic Tags</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
