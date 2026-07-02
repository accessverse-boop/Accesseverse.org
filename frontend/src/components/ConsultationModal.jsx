import React, { useState } from 'react';
import axios from 'axios';
import { ACCESS_VERSE } from '@/constants/testIds';
import { X, Calendar, Clock, CheckCircle2, ShieldAlert, Sparkles, Send } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function ConsultationModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    preferred_date: '',
    preferred_time: '',
    accessibility_needs: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.company.trim() || !formData.preferred_date || !formData.preferred_time) {
      setError('Please fill in all required fields marked with *');
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        company: formData.company,
        preferred_date: formData.preferred_date,
        preferred_time: formData.preferred_time,
        accessibility_needs: formData.accessibility_needs || null,
      };

      await axios.post(`${API}/consultations`, payload);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'An unexpected error occurred while booking. Please try again.');
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
        aria-labelledby="consult-modal-title"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 md:p-8 shadow-2xl dark:bg-slate-950 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close consultation modal"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-600 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="mb-4 rounded-full bg-emerald-50 p-3 text-emerald-500 dark:bg-emerald-950/30">
              <CheckCircle2 className="h-16 w-16" />
            </div>
            <h2 id="consult-modal-title" className="text-2xl font-bold text-[#0B192C] dark:text-white tracking-tight">
              Consultation Booked!
            </h2>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Your video consultation has been successfully requested. We have sent the calendar invite details to your inbox. 
              Our accessibility directors will confirm the slot or provide alternative timing within 2 hours.
            </p>
            <div className="mt-6 text-xs text-left bg-slate-50 p-4 rounded-xl border dark:bg-slate-900/40 dark:border-slate-800 border-dashed space-y-2">
              <p className="text-slate-500"><strong>Requested Slot:</strong></p>
              <div className="flex items-center gap-2 text-[#0066FF] font-semibold text-sm">
                <Calendar className="h-4 w-4" /> {formData.preferred_date}
                <Clock className="h-4 w-4 ml-2" /> {formData.preferred_time}
              </div>
            </div>
            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  name: '',
                  email: '',
                  company: '',
                  preferred_date: '',
                  preferred_time: '',
                  accessibility_needs: '',
                });
                onClose();
              }}
              className="mt-8 rounded-xl bg-[#0066FF] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-[#0066FF] flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                1-on-1 Access Consultation
              </span>
              <h2 id="consult-modal-title" className="text-2xl font-bold text-[#0B192C] dark:text-white mt-1 tracking-tight">
                Book Expert Consultation
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Meet with our core accessibility engineers to discuss Section 508 / PDF remediation pathways.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-50 p-4 text-sm text-red-700 dark:bg-red-950/20 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="consult-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  id="consult-name"
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  data-testid={ACCESS_VERSE.consultFormName}
                  placeholder="e.g. David Vance"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm transition focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="consult-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  id="consult-email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  data-testid={ACCESS_VERSE.consultFormEmail}
                  placeholder="e.g. dvance@healthcare.org"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm transition focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              {/* Company */}
              <div>
                <label htmlFor="consult-company" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Company / Agency *
                </label>
                <input
                  id="consult-company"
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleInputChange}
                  data-testid={ACCESS_VERSE.consultFormCompany}
                  placeholder="e.g. Federal Insurance Corp"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm transition focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Date */}
                <div>
                  <label htmlFor="consult-date" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Date *
                  </label>
                  <input
                    id="consult-date"
                    type="date"
                    name="preferred_date"
                    required
                    value={formData.preferred_date}
                    onChange={handleInputChange}
                    data-testid={ACCESS_VERSE.consultFormDate}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm transition focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>

                {/* Time */}
                <div>
                  <label htmlFor="consult-time" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Time *
                  </label>
                  <input
                    id="consult-time"
                    type="time"
                    name="preferred_time"
                    required
                    value={formData.preferred_time}
                    onChange={handleInputChange}
                    data-testid={ACCESS_VERSE.consultFormTime}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm transition focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Special needs or notes */}
              <div>
                <label htmlFor="consult-needs" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Compliance Scope or Questions (Optional)
                </label>
                <textarea
                  id="consult-needs"
                  name="accessibility_needs"
                  rows={2}
                  value={formData.accessibility_needs}
                  onChange={handleInputChange}
                  data-testid={ACCESS_VERSE.consultFormNeeds}
                  placeholder="e.g. Seeking VPAT Support for a new learning software suite..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-sm transition focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white resize-none"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-900">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-5 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-50 transition dark:hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                data-testid={ACCESS_VERSE.consultFormSubmit}
                className="rounded-xl bg-[#0066FF] px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Book Consultation
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
