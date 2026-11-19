import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LifeBuoy, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Mail, 
  User as UserIcon, 
  MessageSquare, 
  Building2, 
  GraduationCap, 
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ContactSupportPage() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.full_name || '',
    email: user?.email || '',
    user_type: user?.role === 'RECRUITER' ? 'RECRUITER' : 'CANDIDATE',
    subject: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!formData.name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!formData.subject.trim()) {
      setError('Please enter a subject for your request.');
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setError('Please provide more details in your message (at least 10 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitSupportTicket({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        user_type: formData.user_type,
        subject: formData.subject.trim(),
        message: formData.message.trim()
      });

      setSubmittedTicket(res);
    } catch (err) {
      const errData = err.data || {};
      const firstError = Object.values(errData)[0];
      const errorMsg = Array.isArray(firstError) 
        ? firstError[0] 
        : (typeof firstError === 'string' ? firstError : (err.message || 'Failed to submit support request. Please try again.'));
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setFormData({
      name: user?.full_name || '',
      email: user?.email || '',
      user_type: user?.role === 'RECRUITER' ? 'RECRUITER' : 'CANDIDATE',
      subject: '',
      message: ''
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">

        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
            <LifeBuoy className="w-4 h-4 text-blue-600" />
            <span>Nexora Help & Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            How Can We Help You?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Have questions about ATS scoring, skill assessments, employer verification, or account settings? Our dedicated operations team is here to assist.
          </p>
        </div>

        {/* Main Grid: Form + Info Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Form / Success Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            {submittedTicket ? (
              <div className="space-y-6 text-center py-6 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    Ticket #{submittedTicket.id} Created
                  </span>
                  <h2 className="text-2xl font-black text-navy-900">
                    Support Request Received!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{submittedTicket.name}</strong>. A confirmation has been sent to <strong>{submittedTicket.email}</strong>, and our support team has been notified.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2 text-slate-700">
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-medium">Subject:</span>
                    <span className="font-semibold text-slate-900">{submittedTicket.subject}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500 font-medium">Category:</span>
                    <span className="font-semibold text-slate-900">{submittedTicket.user_type === 'RECRUITER' ? 'Recruiter / Employer' : 'Candidate'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Expected Response:</span>
                    <span className="font-semibold text-teal-700">Within 24 business hours</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Submit Another Request
                  </button>
                  <Link
                    to="/"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20 transition"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h2 className="text-lg font-bold text-navy-900">Send an Inquiry</h2>
                  <p className="text-xs text-slate-500">Fill in the form below and we will get back to you promptly.</p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* User Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">I am a</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, user_type: 'CANDIDATE' }))}
                      className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                        formData.user_type === 'CANDIDATE'
                          ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Candidate / Job Seeker</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, user_type: 'RECRUITER' }))}
                      className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border text-xs font-bold transition ${
                        formData.user_type === 'RECRUITER'
                          ? 'border-teal-600 bg-teal-50/70 text-teal-800 shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Recruiter / Employer</span>
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Alex Morgan"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="alex@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-xs font-bold text-slate-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Question about skill assessment result / Recruiter verification status"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-slate-700 mb-1">
                    Message Details <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please explain your question or issue in detail so we can help quickly..."
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition resize-y"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Minimum 10 characters.</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Request...' : 'Submit Support Request'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Support SLA & FAQs */}
          <div className="lg:col-span-5 space-y-6">

            {/* Official Support Email Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-navy-900 flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Official Nexora Email</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prefer to write directly through your default email client? Contact our unified support desk:
              </p>
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] text-blue-700/80 font-bold uppercase tracking-wider block">Official Address</span>
                  <a 
                    href="mailto:nexora.officalss@gmail.com" 
                    className="text-xs sm:text-sm font-bold text-blue-700 hover:text-blue-900 hover:underline truncate block"
                  >
                    nexora.officalss@gmail.com
                  </a>
                </div>
                <a 
                  href="mailto:nexora.officalss@gmail.com" 
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition"
                >
                  Write Email &rarr;
                </a>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-navy-900 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Response Times & Hours</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our support team is active Monday through Friday, 9:00 AM – 6:00 PM UTC.
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 font-medium">Recruiter Verifications:</span>
                  <span className="font-bold text-navy-900">12 – 24 hrs</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 font-medium">Assessment Scoring Inquiries:</span>
                  <span className="font-bold text-navy-900">&lt; 12 hrs</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600 font-medium">General Account Support:</span>
                  <span className="font-bold text-navy-900">&lt; 24 hrs</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-navy-900 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Verified Scam Protection</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If you encounter a job posting asking for payment, crypto deposit, or suspicious communications, please report it immediately. Our moderation team reviews all flagged listings with highest priority.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 space-y-2">
              <span className="font-bold flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>Need immediate account access?</span>
              </span>
              <p className="text-blue-800 leading-relaxed text-[11px]">
                Already registered? <Link to="/login" className="underline font-bold">Sign in</Link> to view real-time assessment badges, job applications, and personalized recommendations.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
