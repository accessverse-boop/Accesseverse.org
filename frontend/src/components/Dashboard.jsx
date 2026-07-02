import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ACCESS_VERSE } from '@/constants/testIds';
import { 
  FileText, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  TrendingUp, 
  Trash2, 
  ChevronRight, 
  Users,
  Search,
  Check
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Dashboard() {
  const [quotes, setQuotes] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('quotes'); // 'quotes', 'consultations'
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [quotesRes, consultsRes] = await Promise.all([
        axios.get(`${API}/quotes`),
        axios.get(`${API}/consultations`)
      ]);
      setQuotes(quotesRes.data);
      setConsultations(consultsRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data from API. Please verify that the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateQuoteStatus = async (id, newStatus) => {
    try {
      const res = await axios.patch(`${API}/quotes/${id}/status`, { status: newStatus });
      setQuotes((prev) => prev.map((q) => (q.id === id ? res.data : q)));
    } catch (err) {
      console.error(err);
      alert('Failed to update quote status.');
    }
  };

  const handleUpdateConsultStatus = async (id, newStatus) => {
    try {
      const res = await axios.patch(`${API}/consultations/${id}/status`, { status: newStatus });
      setConsultations((prev) => prev.map((c) => (c.id === id ? res.data : c)));
    } catch (err) {
      console.error(err);
      alert('Failed to update consultation status.');
    }
  };

  const filteredQuotes = quotes.filter((q) => {
    const search = searchTerm.toLowerCase();
    return (
      q.name.toLowerCase().includes(search) ||
      q.email.toLowerCase().includes(search) ||
      q.company.toLowerCase().includes(search) ||
      q.details.toLowerCase().includes(search)
    );
  });

  const filteredConsultations = consultations.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search) ||
      c.company.toLowerCase().includes(search) ||
      (c.accessibility_needs && c.accessibility_needs.toLowerCase().includes(search))
    );
  });

  const totalPagesRemediated = quotes.reduce((acc, q) => acc + (q.estimated_pages || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-[#F8F9FA] dark:bg-slate-950 min-h-screen">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            Compliance Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Review and manage incoming document remediation requests, site audits, and partner consultations.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 self-start md:self-center px-4 py-2 text-xs font-semibold text-white bg-[#0066FF] hover:bg-blue-700 rounded-xl transition shadow-sm"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30">
          {error}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">Total Quotes</span>
            <div className="rounded-full bg-blue-50 p-2 text-[#0066FF] dark:bg-blue-950/30">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#0B192C] dark:text-white mt-2">{quotes.length}</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2">
            <Clock className="h-3 w-3 text-yellow-500" />
            <span>{quotes.filter(q => q.status === 'Pending').length} Pending review</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">Consultations</span>
            <div className="rounded-full bg-purple-50 p-2 text-purple-600 dark:bg-purple-950/30">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#0B192C] dark:text-white mt-2">{consultations.length}</p>
          <div className="flex items-center gap-1 text-[11px] text-[#10B981] mt-2">
            <CheckCircle2 className="h-3 w-3" />
            <span>All slots active</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">Remediated Pages</span>
            <div className="rounded-full bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/30">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#0B192C] dark:text-white mt-2">{totalPagesRemediated}</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span>Across all uploaded corpora</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">SLA Performance</span>
            <div className="rounded-full bg-orange-50 p-2 text-orange-500 dark:bg-orange-950/30">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#0B192C] dark:text-white mt-2">100%</p>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2">
            <Check className="h-3 w-3 text-[#10B981]" />
            <span>Under 24 hour turnaround</span>
          </div>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === 'quotes'
                ? 'bg-[#0066FF] text-white'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Quote Requests ({quotes.length})
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === 'consultations'
                ? 'bg-[#0066FF] text-white'
                : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            Consultation Slots ({consultations.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search submissions..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus-visible:ring-2 focus-visible:ring-[#0066FF] focus-visible:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          />
        </div>
      </div>

      {/* List Submissions */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <div className="h-8 w-8 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
          <span className="mt-3 text-sm">Querying database documents...</span>
        </div>
      ) : activeTab === 'quotes' ? (
        filteredQuotes.length === 0 ? (
          <div className="text-center py-20 border border-slate-200 rounded-2xl bg-white dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-500">No quote requests found matching your query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredQuotes.map((q) => (
              <div 
                key={q.id}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold uppercase text-slate-400">
                      ID: #{q.id.substring(q.id.length - 8)}
                    </span>
                    <select
                      value={q.status}
                      onChange={(e) => handleUpdateQuoteStatus(q.id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition ${
                        q.status === 'Pending' 
                          ? 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30'
                          : q.status === 'In Remediation'
                          ? 'bg-blue-50 text-[#0066FF] border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Remediation">In Remediation</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <h3 className="text-lg font-bold text-[#0B192C] dark:text-white tracking-tight">{q.company}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <strong>Contact:</strong> {q.name} (<span className="text-xs font-mono">{q.email}</span>)
                    </p>
                    {q.website && (
                      <p className="text-xs text-slate-400">
                        <strong>Website:</strong> <a href={q.website} target="_blank" rel="noreferrer" className="underline hover:text-[#0066FF]">{q.website}</a>
                      </p>
                    )}
                    {q.estimated_pages && (
                      <p className="text-xs text-slate-400">
                        <strong>Volume:</strong> {q.estimated_pages} estimated PDF pages
                      </p>
                    )}
                  </div>

                  {q.services && q.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {q.services.map((s) => (
                        <span key={s} className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded border border-slate-100 dark:border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-4">
                      &quot;{q.details}&quot;
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Submitted: {new Date(q.created_at).toLocaleDateString()}</span>
                  <span>{new Date(q.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        filteredConsultations.length === 0 ? (
          <div className="text-center py-20 border border-slate-200 rounded-2xl bg-white dark:border-slate-800 dark:bg-slate-900">
            <p className="text-slate-500">No scheduled consultations found matching your query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredConsultations.map((c) => (
              <div 
                key={c.id}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono font-bold uppercase text-slate-400">
                      ID: #{c.id.substring(c.id.length - 8)}
                    </span>
                    <select
                      value={c.status}
                      onChange={(e) => handleUpdateConsultStatus(c.id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition ${
                        c.status === 'Confirmed' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                          : 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <h3 className="text-lg font-bold text-[#0B192C] dark:text-white tracking-tight">{c.company}</h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <strong>Consultant:</strong> {c.name} (<span className="text-xs font-mono">{c.email}</span>)
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#0066FF] font-semibold mt-3 bg-blue-50/50 p-2 rounded-lg border border-blue-100 dark:bg-blue-950/10 dark:border-blue-900/20 max-w-max">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{c.preferred_date}</span>
                      <ChevronRight className="h-3 w-3" />
                      <Clock className="h-3.5 w-3.5" />
                      <span>{c.preferred_time}</span>
                    </div>
                  </div>

                  {c.accessibility_needs && (
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850">
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                        &quot;{c.accessibility_needs}&quot;
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Logged: {new Date(c.created_at).toLocaleDateString()}</span>
                  <span>{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
