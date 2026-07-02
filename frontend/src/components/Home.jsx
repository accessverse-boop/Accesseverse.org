import React, { useState } from 'react';
import { ACCESS_VERSE, HOME } from '@/constants/testIds';
import BeforeAfterSlider from './BeforeAfterSlider';
import FloatingAccessibilityPanel from './FloatingAccessibilityPanel';
import DesignSystemView from './DesignSystemView';
import QuoteFormModal from './QuoteFormModal';
import ConsultationModal from './ConsultationModal';

import { 
  ArrowRight, 
  FileText, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  Activity, 
  Search, 
  UploadCloud, 
  Users, 
  Sparkles, 
  HelpCircle, 
  Mail, 
  MessageSquare, 
  BookOpen, 
  Calendar,
  Building,
  Check,
  CheckCircle,
  Eye,
  Settings,
  ChevronDown
} from 'lucide-react';

export default function Home() {
  const [activePage, setActiveTab] = useState('homepage'); // 'homepage', 'design-system', 'dashboard'
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  
  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const servicesList = [
    {
      title: 'PDF Accessibility Remediation',
      desc: 'Expertly adding structural tags, alternate text, and logical reading order to complex PDFs to exceed WCAG 2.2 / PDF/UA standards.',
      icon: <FileText className="h-6 w-6 text-[#0066FF]" />,
    },
    {
      title: 'PDF Accessibility Testing',
      desc: 'Rigorous manual and automated inspection of document corpora to isolate structural errors, tagging errors, and visual deficits.',
      icon: <Activity className="h-6 w-6 text-[#0066FF]" />,
    },
    {
      title: 'Web Accessibility Audits',
      desc: 'End-to-end audits of enterprise web platforms, custom dashboards, and client portals against the full WCAG 2.2 criteria.',
      icon: <Search className="h-6 w-6 text-[#0066FF]" />,
    },
    {
      title: 'WCAG 2.2 Compliance',
      desc: 'Step-by-step review to guarantee your content meets the latest Level A, AA, and AAA standards released by the W3C.',
      icon: <ShieldCheck className="h-6 w-6 text-[#0066FF]" />,
    },
    {
      title: 'ADA Compliance',
      desc: 'Avoiding litigation risks for public accommodations by aligning public web assets with Title III legal expectations.',
      icon: <CheckCircle2 className="h-6 w-6 text-[#0066FF]" />,
    },
    {
      title: 'Section 508 Compliance',
      desc: 'Helping federal contractors, agencies, and suppliers meet electronic and information technology accessibility standards.',
      icon: <Building className="h-6 w-6 text-[#0066FF]" />,
    },
    {
      title: 'VPAT Support',
      desc: 'Drafting authoritative Voluntary Product Accessibility Templates to prove software procurement compliance for government sales.',
      icon: <Layers className="h-6 w-6 text-[#0066FF]" />,
    },
    {
      title: 'Accessibility Consulting',
      desc: 'Continuous advisory support, custom corporate training, and design system reviews for engineering and design departments.',
      icon: <Users className="h-6 w-6 text-[#0066FF]" />,
    }
  ];

  const processSteps = [
    { title: 'Upload Files', desc: 'Securely submit your unstructured PDFs or website domains.' },
    { title: 'Accessibility Review', desc: 'Our automated engines and certified experts run an in-depth audit.' },
    { title: 'Actionable Quote', desc: 'Get a clear, flat-rate scope statement and remediation blueprint.' },
    { title: 'Remediation', desc: 'Engineers meticulously inject tag structure and logical order.' },
    { title: 'Quality Assurance', desc: 'Verification using assistive technologies (JAWS, NVDA, VoiceOver).' },
    { title: 'Delivery', desc: 'Download fully-certified, compliant PDFs or launch verified platforms.' }
  ];

  const faqItems = [
    {
      q: 'What is PDF Remediation and why is it required?',
      a: 'PDF Remediation is the process of tagging the digital elements of a PDF document so that assistive technologies, like screen readers, can interpret its content logically. Without correct tags, a screen reader cannot parse headers, tables, images, or paragraph order, which violates WCAG 2.2 and PDF/UA standards.'
    },
    {
      q: 'Does AccessVerse support WCAG 2.2 AA standards?',
      a: 'Yes. All of our remediation services, web audits, and consulting structures follow the latest WCAG 2.2 AA and Section 508 criteria. We also support WCAG 2.2 AAA guidelines for organizations requiring the absolute peak level of accessible compliance.'
    },
    {
      q: 'How does AccessVerse deliver VPAT support?',
      a: 'We perform a complete audit of your web or desktop application, identify compliance gaps, and draft a formal Voluntary Product Accessibility Template (VPAT) using the ACR (Accessibility Conformance Report) framework. This is critical for selling software to government, healthcare, or educational institutions.'
    },
    {
      q: 'Do you offer a flat-rate price quote?',
      a: 'Absolutely. Unlike unpredictable billing structures, we provide precise, fixed-price quotes based on document page counts, complexity levels, or site audit scope. Simply submit a Quote Request to receive a custom quote within 24 hours.'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans antialiased text-[#0B192C] dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. Header & Navigation */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#0066FF] flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/10">
              A
            </div>
            <div className="text-left leading-tight">
              <span className="text-lg font-black tracking-tight text-[#0B192C] dark:text-white">AccessVerse</span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-widest">accessverse.org</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
            <button
              onClick={() => setActiveTab('homepage')}
              data-testid={ACCESS_VERSE.homepageTab}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === 'homepage'
                  ? 'bg-[#0066FF] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white'
              }`}
            >
              Homepage
            </button>
            <button
              onClick={() => setActiveTab('design-system')}
              data-testid={ACCESS_VERSE.designSystemTab}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === 'design-system'
                  ? 'bg-[#0066FF] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0B192C] dark:hover:text-white'
              }`}
            >
              Design System
            </button>
          </nav>

          {/* Header Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsQuoteOpen(true)}
              data-testid={ACCESS_VERSE.quoteRequestBtn}
              className="rounded-xl bg-[#0066FF] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 transition duration-200 active:scale-95"
            >
              Get Free Quote
            </button>
          </div>
        </div>
      </header>

      {/* Conditional Rendering of Views */}
      {activePage === 'design-system' ? (
        <DesignSystemView />
      ) : (
        /* --- HOMEPAGE VIEW --- */
        <>
          {/* 2. Hero Section */}
          <section className="relative overflow-hidden py-24 md:py-32 border-b border-slate-100 dark:border-slate-900 bg-[#FFFFFF] dark:bg-slate-950">
            {/* Subtle Abstract Background grid/lines */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
              <div className="w-full h-full bg-[radial-gradient(#0066FF_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Content Column */}
              <div className="lg:col-span-6 text-left space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/20 px-3.5 py-1.5 text-xs font-semibold text-[#0066FF] border border-blue-100/50 dark:border-blue-900/30">
                  <Sparkles className="h-3.5 w-3.5" />
                  Enterprise Accessibility Partners
                </span>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B192C] dark:text-white tracking-tighter leading-[1.05]">
                  Making Digital Content <br className="hidden sm:inline" />
                  <span className="text-[#0066FF] relative">Accessible</span> for Everyone.
                </h1>
                
                <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                  Helping organizations achieve WCAG 2.2, ADA, PDF/UA and Section 508 compliance through expert PDF remediation and accessibility audits.
                </p>

                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <button
                    onClick={() => setIsQuoteOpen(true)}
                    data-testid={ACCESS_VERSE.quoteRequestBtn}
                    className="rounded-xl bg-[#0066FF] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-700 hover:-translate-y-0.5 transition duration-200 flex items-center justify-center gap-2"
                  >
                    Get Free Quote
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsConsultOpen(true)}
                    data-testid={ACCESS_VERSE.bookConsultationBtn}
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-[#0B192C] shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 transition duration-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800/80 flex items-center justify-center gap-2"
                  >
                    Book Consultation
                  </button>
                </div>
              </div>

              {/* Right Illustration Column (SaaS Dashboard Visual Representation) */}
              <div className="lg:col-span-6 animate-in fade-in slide-in-from-right-8 duration-1000">
                <div className="relative p-6 md:p-8 rounded-3xl border border-slate-200/80 bg-slate-50/50 shadow-xl dark:border-slate-800 dark:bg-slate-900/30 backdrop-blur-xl">
                  
                  {/* Floating Elements / Circular Score */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Element 1: Score */}
                    <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/80 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">A11y Score</span>
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">OPTIMAL</span>
                      </div>
                      <div className="mt-4 flex items-baseline gap-1.5">
                        <span className="text-4xl font-black text-[#0B192C] dark:text-white">98</span>
                        <span className="text-xs text-slate-400">/ 100</span>
                      </div>
                      <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-[#10B981] rounded-full" style={{ width: '98%' }} />
                      </div>
                    </div>

                    {/* Element 2: Compliance Status */}
                    <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/80 shadow-sm flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compliance Status</span>
                        <ShieldCheck className="h-4 w-4 text-[#0066FF]" />
                      </div>
                      <div className="mt-4">
                        <span className="text-base font-bold text-[#0B192C] dark:text-white block">WCAG 2.2 AA</span>
                        <span className="text-xs text-[#10B981] font-semibold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="h-3 w-3" /> Fully Certified
                        </span>
                      </div>
                    </div>

                    {/* Element 3: PDF Remediation Active queue */}
                    <div className="col-span-2 rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/80 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PDF Remediation Pipeline</span>
                        <span className="text-[10px] font-bold text-[#0066FF] bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded border border-blue-100/50">Processing</span>
                      </div>
                      
                      {/* Active queue lines */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">Annual_Report_2025.pdf</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-100">Remediated</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">Course_Syllabus_HCI.pdf</span>
                          <span className="text-[10px] text-blue-700 bg-blue-50 dark:bg-blue-950/20 font-bold px-1.5 py-0.5 rounded border border-blue-100 animate-pulse">Tagging Structure...</span>
                        </div>
                      </div>
                    </div>

                    {/* Element 4: Screen Reader Compatible & Keyboard Nav indicators */}
                    <div className="col-span-2 rounded-2xl border border-slate-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/80 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#0066FF]/10 flex items-center justify-center text-[#0066FF] dark:bg-blue-950/20">
                          <Users className="h-5 w-5" />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-bold text-[#0B192C] dark:text-white block">Screen Reader Friendly</span>
                          <span className="text-[10px] text-slate-400 font-medium">Full Speech Synthesizer Integration</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-850">
                        <span className="text-[10px] font-mono font-bold text-[#0066FF]">Tab Focus:</span>
                        <span className="text-[10px] font-mono text-emerald-600 font-bold">Passed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Trust Section */}
          <section className="py-12 bg-[#F8F9FA] dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-900 text-center">
            <div className="max-w-7xl mx-auto px-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                Our Certifications &amp; Standards compliance
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                {/* Badge 1 */}
                <div className="flex items-center gap-2 border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 px-4 py-2.5 rounded-xl shadow-sm hover:border-[#0066FF] transition duration-300">
                  <span className="text-[#0B192C] dark:text-white text-sm font-extrabold tracking-wider">WCAG 2.2</span>
                  <span className="text-xs text-slate-400 font-medium border-l border-slate-200 dark:border-slate-800 pl-2">Level AA</span>
                </div>
                {/* Badge 2 */}
                <div className="flex items-center gap-2 border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 px-4 py-2.5 rounded-xl shadow-sm hover:border-[#0066FF] transition duration-300">
                  <span className="text-[#0B192C] dark:text-white text-sm font-extrabold tracking-wider">PDF/UA</span>
                  <span className="text-xs text-slate-400 font-medium border-l border-slate-200 dark:border-slate-800 pl-2">ISO 14289</span>
                </div>
                {/* Badge 3 */}
                <div className="flex items-center gap-2 border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 px-4 py-2.5 rounded-xl shadow-sm hover:border-[#0066FF] transition duration-300">
                  <span className="text-[#0B192C] dark:text-white text-sm font-extrabold tracking-wider">ADA</span>
                  <span className="text-xs text-slate-400 font-medium border-l border-slate-200 dark:border-slate-800 pl-2">Title III</span>
                </div>
                {/* Badge 4 */}
                <div className="flex items-center gap-2 border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 px-4 py-2.5 rounded-xl shadow-sm hover:border-[#0066FF] transition duration-300">
                  <span className="text-[#0B192C] dark:text-white text-sm font-extrabold tracking-wider">SEC 508</span>
                  <span className="text-xs text-slate-400 font-medium border-l border-slate-200 dark:border-slate-800 pl-2">VPAT 2.4</span>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Services Section */}
          <section id="services" className="py-24 md:py-32 bg-white dark:bg-slate-950 text-left">
            <div className="max-w-7xl mx-auto px-6">
              <div className="max-w-xl space-y-3 mb-16">
                <span className="text-xs font-semibold tracking-widest uppercase text-[#0066FF] block">Compliance Offerings</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0B192C] dark:text-white tracking-tight">
                  Premium Accessibility Solutions
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                  Tailored services built to protect enterprise organizations, educational systems, healthcare networks, and governmental entities from litigation while offering absolute digital inclusivity.
                </p>
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {servicesList.map((service, index) => (
                  <div
                    key={index}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,102,255,0.05)] hover:border-blue-200 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900/60 flex flex-col justify-between"
                  >
                    <div>
                      <div className="rounded-xl bg-blue-50/50 p-2.5 w-11 h-11 flex items-center justify-center dark:bg-blue-950/20 group-hover:bg-[#0066FF]/10 group-hover:scale-105 transition-all">
                        {service.icon}
                      </div>
                      <h3 className="text-base font-bold text-[#0B192C] dark:text-white mt-4 group-hover:text-[#0066FF] transition duration-200">
                        {service.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Why Choose AccessVerse */}
          <section className="py-24 bg-[#F8F9FA] dark:bg-slate-900/20 border-t border-b border-slate-100 dark:border-slate-900/50 text-left">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs font-semibold tracking-widest uppercase text-[#0066FF] block">Our Advantage</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0B192C] dark:text-white tracking-tight">
                  Designed for Elite Enterprise Scale
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  We reject basic &quot;overlay widgets&quot; or template generators. AccessVerse delivers authentic, native WCAG tag remediation directly at the source code and PDF object level.
                </p>
                <div className="space-y-3.5 pt-4">
                  <div className="flex items-start gap-2.5">
                    <div className="rounded-full bg-[#10B981]/10 p-1 text-[#10B981]">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      We never use fragile visual overrides — only semantic markup
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="rounded-full bg-[#10B981]/10 p-1 text-[#10B981]">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      ISO 14289-1 (PDF/UA) compliant structure tag compilation
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="rounded-full bg-[#10B981]/10 p-1 text-[#10B981]">
                      <Check className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Authoritative VPAT 2.4 reporting structure accepted by state procurement officers
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Advantage Card 1 */}
                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm space-y-2">
                  <span className="text-2xl font-black text-[#0066FF]">99.8%</span>
                  <h4 className="text-sm font-bold text-[#0B192C] dark:text-white">remit accuracy</h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    Strict manual auditing matching double-blind human screen reader validations.
                  </p>
                </div>

                {/* Advantage Card 2 */}
                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm space-y-2">
                  <span className="text-2xl font-black text-[#0066FF]">1.2M+</span>
                  <h4 className="text-sm font-bold text-[#0B192C] dark:text-white">pages remediated</h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    Successfully delivered clean archives for public healthcare bodies and universities.
                  </p>
                </div>

                {/* Advantage Card 3 */}
                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm space-y-2">
                  <span className="text-2xl font-black text-[#0066FF]">100%</span>
                  <h4 className="text-sm font-bold text-[#0B192C] dark:text-white">legal safety</h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    Designed to fully protect contracts against OCR failure and structural non-compliance.
                  </p>
                </div>

                {/* Advantage Card 4 */}
                <div className="rounded-2xl bg-white border border-slate-200/80 p-5 dark:border-slate-800 dark:bg-slate-950/60 shadow-sm space-y-2">
                  <span className="text-2xl font-black text-[#0066FF]">&lt;2hr</span>
                  <h4 className="text-sm font-bold text-[#0B192C] dark:text-white">SLA reply time</h4>
                  <p className="text-xs text-slate-400 leading-normal">
                    Our procurement desk coordinates custom quotes immediately on request.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Process Section (Beautiful Timeline) */}
          <section className="py-24 md:py-32 bg-white dark:bg-slate-950 text-center">
            <div className="max-w-7xl mx-auto px-6">
              <div className="max-w-xl mx-auto space-y-3 mb-16 text-center">
                <span className="text-xs font-semibold tracking-widest uppercase text-[#0066FF] block">Service Lifecycle</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0B192C] dark:text-white tracking-tight">
                  Seamless Remediation Process
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  How we process unstructured corpora into completely accessible assets without interrupting your workflows.
                </p>
              </div>

              {/* Timeline Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
                {processSteps.map((step, index) => (
                  <div key={index} className="relative flex flex-col items-center group">
                    {/* Visual Number circle */}
                    <div className="h-10 w-10 rounded-full bg-blue-50 dark:bg-blue-950/30 text-[#0066FF] font-extrabold text-sm flex items-center justify-center border border-blue-100/50 dark:border-blue-900/30 group-hover:bg-[#0066FF] group-hover:text-white transition duration-300">
                      {index + 1}
                    </div>

                    <h3 className="text-xs font-bold text-[#0B192C] dark:text-white mt-4 group-hover:text-[#0066FF] transition">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed max-w-[150px]">
                      {step.desc}
                    </p>

                    {/* Connector line for large screens */}
                    {index < 5 && (
                      <div className="hidden lg:block absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 bg-slate-100 dark:bg-slate-800" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 7. Before & After Accessibility Component */}
          <section className="py-24 bg-[#F8F9FA] dark:bg-slate-900/10 border-t border-b border-slate-100 dark:border-slate-900 text-left">
            <div className="max-w-7xl mx-auto px-6">
              <BeforeAfterSlider />
            </div>
          </section>

          {/* 8. Testimonials Section */}
          <section className="py-24 md:py-32 bg-white dark:bg-slate-950 text-left">
            <div className="max-w-7xl mx-auto px-6">
              <div className="max-w-xl space-y-3 mb-16">
                <span className="text-xs font-semibold tracking-widest uppercase text-[#0066FF] block">Client Verification</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0B192C] dark:text-white tracking-tight">
                  Trusted by Accessibility Officers
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  How leading compliance directors and digital equity coordinators successfully achieved and defended organizational conformity.
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Testimonial 1 */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 flex flex-col justify-between">
                  <div>
                    <span className="text-[#0066FF] text-3xl font-serif">“</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic -mt-2">
                      AccessVerse remediated our entire library of financial disclosure statements in under two weeks. Our legal desk was thoroughly satisfied with the ISO certification report. Exceptional turnaround times!
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <img 
                      src="https://images.pexels.com/photos/26872232/pexels-photo-26872232.jpeg?auto=compress&cs=tinysrgb&w=150" 
                      alt="Headshot of Compliance VP"
                      className="h-9 w-9 rounded-full object-cover grayscale"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold block text-[#0B192C] dark:text-white">Marcus Vance</span>
                      <span className="text-[10px] text-slate-400 block font-medium">VP Compliance, Apex Bank Group</span>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 flex flex-col justify-between">
                  <div>
                    <span className="text-[#0066FF] text-3xl font-serif">“</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic -mt-2">
                      With over 40,000 students, achieving Section 508 compliance across our academic syllabus documents was an overwhelming task. AccessVerse automated the structural tagging mapping, protecting our public funding.
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <img 
                      src="https://images.pexels.com/photos/31869537/pexels-photo-31869537.jpeg?auto=compress&cs=tinysrgb&w=150" 
                      alt="Headshot of Director of A11y"
                      className="h-9 w-9 rounded-full object-cover grayscale"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold block text-[#0B192C] dark:text-white">Dr. Aris Thorne</span>
                      <span className="text-[10px] text-slate-400 block font-medium">Director of Digital Equity, State University</span>
                    </div>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 flex flex-col justify-between">
                  <div>
                    <span className="text-[#0066FF] text-3xl font-serif">“</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic -mt-2">
                      AccessVerse web compliance review revealed over fifty high-priority keyboard focus issues on our user portal. Their engineers worked directly with our React team to audit and correct every focus trap. Highly technical team.
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85&w=150" 
                      alt="Headshot of CTO"
                      className="h-9 w-9 rounded-full object-cover grayscale"
                    />
                    <div className="text-left">
                      <span className="text-xs font-bold block text-[#0B192C] dark:text-white">Clara Sterling</span>
                      <span className="text-[10px] text-slate-400 block font-medium">CTO, HealthFirst Portal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 9. FAQ Section */}
          <section className="py-24 bg-[#F8F9FA] dark:bg-slate-900/10 border-t border-b border-slate-100 dark:border-slate-900 text-left">
            <div className="max-w-3xl mx-auto px-6">
              <div className="text-center space-y-3 mb-12">
                <span className="text-xs font-semibold tracking-widest uppercase text-[#0066FF] block">Frictionless Answers</span>
                <h2 className="text-3xl font-bold text-[#0B192C] dark:text-white tracking-tight">
                  Frequently Asked Questions
                </h2>
              </div>

              {/* Minimalist Accordion */}
              <div className="space-y-4">
                {faqItems.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div 
                      key={index}
                      className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${index}`}
                        className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-[#0B192C] dark:text-white hover:text-[#0066FF] transition duration-200"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#0066FF]' : ''}`} />
                      </button>
                      
                      {isOpen && (
                        <div 
                          id={`faq-answer-${index}`}
                          role="region"
                          className="px-5 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3 animate-in fade-in duration-300"
                        >
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 10. Call To Action (CTA) */}
          <section className="py-24 bg-white dark:bg-slate-950 text-center">
            <div className="max-w-5xl mx-auto px-6">
              <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#0066FF_0%,#00B4D8_100%)] p-12 md:p-16 text-white shadow-xl">
                {/* Subtle visual gradient texture */}
                <div className="absolute inset-0 bg-white/[0.03] pointer-events-none" />

                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                  <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Achieve absolute compliance
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                    Secure Your Compliance Roadmap Today.
                  </h2>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Protect your contracts, conform with state/federal procurement rules, and offer completely inclusive visual interfaces. Submit page metrics to retrieve a certified quote.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3.5 pt-4">
                    <button
                      onClick={() => setIsQuoteOpen(true)}
                      className="rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-[#0066FF] shadow-md hover:bg-slate-50 transition duration-200"
                    >
                      Request Free Quote
                    </button>
                    <button
                      onClick={() => setIsConsultOpen(true)}
                      className="rounded-xl bg-slate-950/20 border border-white/30 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition duration-200"
                    >
                      Book Free Consultation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 11. Footer */}
      <footer className="bg-[#0B192C] text-white py-16 border-t border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 text-left">
          {/* Logo Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#0066FF] flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/10">
                A
              </div>
              <div className="text-left leading-tight">
                <span className="text-lg font-black tracking-tight text-white block">AccessVerse</span>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-widest">accessverse.org</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
              Making digital systems, applications, and documents universally accessible and compliant with state and federal legal requirements.
            </p>
          </div>

          {/* Service Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00B4D8]">Compliance Services</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>PDF Remediation</li>
              <li>PDF Accessibility Auditing</li>
              <li>Web Accessibility Audits</li>
              <li>ADA Compliancy</li>
              <li>Section 508 VPAT</li>
            </ul>
          </div>

          {/* Target Customers */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00B4D8]">Who We Serve</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>State &amp; Local Government</li>
              <li>Universities &amp; Colleges</li>
              <li>Healthcare &amp; Clinical Portals</li>
              <li>Law Firms &amp; Insurance</li>
              <li>Enterprise SaaS Companies</li>
            </ul>
          </div>

          {/* Quick Contact & Links */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00B4D8]">Contact</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-[#0066FF]" /> info@accessverse.org</li>
              <li className="pt-2">
                <a
                  data-testid={HOME.emergentLink}
                  href="https://emergent.sh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[10px] bg-slate-900 border border-slate-800 text-slate-300 font-bold px-3 py-1.5 rounded-lg hover:border-[#0066FF] transition"
                >
                  Made with Emergent
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium text-left">
          <p>© {new Date().getFullYear()} AccessVerse Corp. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Sitemap</span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Floating Panel */}
      <QuoteFormModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
      <ConsultationModal isOpen={isConsultOpen} onClose={() => setIsConsultOpen(false)} />
      <FloatingAccessibilityPanel />
    </div>
  );
}
