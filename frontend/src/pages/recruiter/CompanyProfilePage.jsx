import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Building2, 
  ShieldCheck, 
  Globe, 
  MapPin, 
  Users, 
  Save, 
  Check, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

export default function CompanyProfilePage() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  // Verification request states
  const [regNumber, setRegNumber] = useState('');
  const [officialEmail, setOfficialEmail] = useState('');
  const [verifNotes, setVerifNotes] = useState('');
  const [verifSubmitted, setVerifSubmitted] = useState(false);

  useEffect(() => {
    fetchCompany();
  }, []);

  async function fetchCompany() {
    setLoading(true);
    try {
      const data = await api.getMyCompany();
      setCompany(data);
      setName(data.name || '');
      setWebsite(data.website || '');
      setIndustry(data.industry || '');
      setCompanySize(data.company_size || '');
      setLocation(data.location || '');
      setDescription(data.description || '');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const updated = await api.updateMyCompany({
        name,
        website,
        industry,
        company_size: companySize,
        location,
        description
      });
      setCompany(updated);
      setMessage("Company details updated successfully!");
    } catch (err) {
      setError("Failed to update company.");
    } finally {
      setSaving(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.submitVerification({
        business_reg_number: regNumber,
        official_domain_email: officialEmail,
        notes: verifNotes
      });
      setVerifSubmitted(true);
      setMessage("Verification request submitted! Platform administrators will review your credentials.");
    } catch (err) {
      setError(err.data?.error || "Failed to submit verification.");
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-xs text-slate-500">Loading company details...</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          {company?.is_verified ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Employer
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
              Verification Pending Review
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Company Profile & Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your public organization profile and request official verification badges.
        </p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium flex items-center">
          <Check className="w-4 h-4 mr-1.5 shrink-0" /> {message}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium flex items-center">
          <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" /> {error}
        </div>
      )}

      {/* Edit Profile Form */}
      <form onSubmit={handleSaveCompany} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs">
        <h2 className="text-sm font-bold text-navy-900 flex items-center">
          <Building2 className="w-4 h-4 mr-2 text-teal-600" /> Organization Specifications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Company Legal Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none font-bold"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Official Website</label>
            <input
              type="url"
              placeholder="https://company.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Industry Sector</label>
            <input
              type="text"
              placeholder="e.g. Cloud Infrastructure, FinTech"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Company Size</label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="1-10 employees">1-10 employees</option>
              <option value="11-50 employees">11-50 employees</option>
              <option value="51-200 employees">51-200 employees</option>
              <option value="201-500 employees">201-500 employees</option>
              <option value="500+ employees">500+ employees</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Headquarters Location</label>
            <input
              type="text"
              placeholder="e.g. San Francisco, CA (Remote Friendly)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">About the Organization</label>
            <textarea
              rows={4}
              placeholder="Provide candidate-facing background, mission statement, engineering culture..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none leading-relaxed"
            ></textarea>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-navy-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-50 flex items-center"
          >
            <Save className="w-4 h-4 mr-1.5" />
            {saving ? 'Saving...' : 'Update Company Profile'}
          </button>
        </div>
      </form>

      {/* Verification Request Box */}
      {!company?.is_verified && !verifSubmitted && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center space-x-2 text-teal-700">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h2 className="text-sm font-bold text-navy-900">Request Official Employer Verification</h2>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Verified companies display trusted badges on every job vacancy and gain priority candidate applications.
          </p>

          <form onSubmit={handleVerificationSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tax / Business Registration Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EIN or Corporate Reg ID"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Corporate Domain Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="hiring@yourcompany.com"
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Verification Notes</label>
              <textarea
                rows={2}
                placeholder="Any links to state registry or official records..."
                value={verifNotes}
                onChange={(e) => setVerifNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
              ></textarea>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow transition"
              >
                Submit Verification Request
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

