import React, { useState } from 'react';
import axios from 'axios';
import { ACCESS_VERSE } from '@/constants/testIds';
import { X, Send, CheckCircle2, ShieldAlert, Sparkles, Building, FileText, Globe } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function QuoteFormModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: '',
    services: [],
    estimated_pages: '',
    details: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const availableServices = [
    'PDF Accessibility Remediation',
    'PDF Accessibility Testing',
    'Web Accessibility Audits',
    'WCAG 2.2 Compliance',
    'ADA Compliance',
    'Section 508 Compliance',
    'VPAT Support',
    'Accessibility Consulting',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleServiceChange = (service) => {
    setFormData((prev) => {
      const alreadySelected = prev.services.includes(service);
      return {
        ...prev,
        services: alreadySelected
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.company.trim() || !formData.details.trim()) {
      setError('Please fill in all required fields marked with *');
      setIsLoading(false);
      return;
    }

    if (formData.details.length < 5) {
      setError('Please provide a bit more detail about your project scope (minimum 5 characters)');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        website: formData.website || null,
        services: formData.services,
        details: formData.details,
        estimated_pages: formData.estimated_pages ? parseInt(formData.estimated_pages, 10) : null,
      };

      await axios.post(`${API}/quotes`, payload);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'An unexpected error occurred while submitting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-modal-title"
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-6 md:p-8 shadow-2xl dark:bg-slate-950 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close quote modal"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-600 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="mb-4 rounded-full bg-emerald-50 p-3 text-emerald-500 dark:bg-emerald-950/30">
              <CheckCircle2 className="h-16 w-16" />
            </div>
            <h2 id="quote-modal-title" className="text-2xl font-bold text-[#0B192C] dark:text-white tracking-tight">
              Request Received Successfully!
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              We&apos;ve logged your project scope and triggered a confirmation email to your inbox. 
              Our compliance team will analyze your requirements and follow up with an actionable quote within 24 hours.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  name: '',
                  email: '',
                  company: '',
                  website: '',
                  services: [],
                  estimated_pages: '',
                  details: '',
                });
                onClose();
              }}
              className="mt-8 rounded-xl bg-[#0066FF] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-[#0066FF] flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Enterprise Solutions
              </span>
              <h2 id="quote-modal-title" className="text-2xl font-bold text-[#0B192C] dark:text-white mt-1 tracking-tight">
                Request a Premium Quote
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Tell us about your digital content scope. Achieve fully-compliant remediation on schedule.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label htmlFor="quote-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Name *
                </label>
                <input
                  id="quote-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  data-testid={ACCESS_VERSE.quoteFormName}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm transition focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="quote-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Business Email *
                </label>
                <input
                  id="quote-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  data-testid={ACCESS_VERSE.quoteFormEmail}
                  placeholder="e.g. sjenkins@company.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm transition focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              {/* Company */}
              <div>
                <label htmlFor="quote-company" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Organization / Company *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="quote-company"
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    data-testid={ACCESS_VERSE.quoteFormCompany}
                    placeholder="e.g. State University / Apex Bank"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 p-3 text-sm transition focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label htmlFor="quote-website" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Website URL (Optional)
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="quote-website"
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    data-testid={ACCESS_VERSE.quoteFormWebsite}
                    placeholder="e.g. https://company.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 p-3 text-sm transition focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Services Multi-Select */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Services Requested
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 rounded-xl border border-slate-100 bg-slate-50/30 dark:border-slate-900 dark:bg-slate-950/40">
                {availableServices.map((service) => {
                  const isChecked = formData.services.includes(service);
                  return (
                    <button
                      key={service}
                      type="button"
                      onClick={() => handleServiceChange(service)}
                      data-testid={`${ACCESS_VERSE.quoteFormServices}-${service.replace(/\s+/g, '-').toLowerCase()}`}
                      className={`flex items-center justify-between text-left rounded-lg p-2 text-xs transition border ${
                        isChecked 
                          ? 'border-[#0066FF] bg-blue-50/40 text-[#0066FF] dark:bg-blue-950/20' 
                          : 'border-slate-100 hover:bg-slate-50 dark:border-slate-900'
                      }`}
                    >
                      <span className="font-medium truncate mr-2">{service}</span>
                      <div className={`h-4 w-4 rounded flex items-center justify-center border transition ${
                        isChecked ? 'border-[#0066FF] bg-[#0066FF] text-white' : 'border-slate-300'
                      }`}>
                        {isChecked && <CheckCircle2 className="h-3 w-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Estimated pages */}
              <div className="md:col-span-1">
                <label htmlFor="quote-pages" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Est. PDF Pages
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="quote-pages"
                    type="number"
                    name="estimated_pages"
                    value={formData.estimated_pages}
                    onChange={handleInputChange}
                    data-testid={ACCESS_VERSE.quoteFormPages}
                    placeholder="e.g. 500"
                    min="1"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-3 p-3 text-sm transition focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Project Scope details */}
              <div className="md:col-span-2">
                <label htmlFor="quote-details" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Project details / Scope *
                </label>
                <textarea
                  id="quote-details"
                  name="details"
                  required
                  rows={2}
                  value={formData.details}
                  onChange={handleInputChange}
                  data-testid={ACCESS_VERSE.quoteFormDetails}
                  placeholder="Tell us about your document types, volume, WCAG target standard, or timeframe..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm transition focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white resize-none"
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-900">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition dark:hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                data-testid={ACCESS_VERSE.quoteFormSubmit}
                className="rounded-xl bg-[#0066FF] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
