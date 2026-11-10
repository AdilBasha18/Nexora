import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Star, 
  Check, 
  AlertCircle, 
  Eye, 
  Clock, 
  X,
  FileCheck
} from 'lucide-react';

export default function CandidateResumesPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Preview modal
  const [previewResume, setPreviewResume] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  async function fetchResumes() {
    setLoading(true);
    try {
      const data = await api.getResumes();
      setResumes(data.results || data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a PDF or DOCX file to upload.");
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', title || selectedFile.name);

      await api.uploadResume(formData);
      setSuccess("Resume uploaded and parsed successfully! Skills updated.");
      setSelectedFile(null);
      setTitle('');
      fetchResumes();
    } catch (err) {
      setError(err.data?.file?.[0] || err.data?.error || "Failed to upload resume. Ensure it is under 5MB.");
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (id) => {
    try {
      await api.setPrimaryResume(id);
      fetchResumes();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await api.deleteResume(id);
      fetchResumes();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          My Resumes & Parsing
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload resumes in PDF or DOCX format. Nexora extracts your technical skills and background to power ATS scoring and job recommendations.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h2 className="text-sm font-bold text-navy-900 mb-4 flex items-center">
          <Upload className="w-4 h-4 mr-2 text-blue-600" />
          Upload New Resume
        </h2>

        {success && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs mb-4 font-medium flex items-center">
            <Check className="w-4 h-4 mr-1.5 shrink-0" /> {success}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs mb-4 font-medium flex items-center">
            <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Resume Title</label>
              <input
                type="text"
                placeholder="e.g. Software Engineer 2026 Resume"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select File (PDF, DOCX up to 5MB)</label>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                className="w-full text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center"
            >
              {uploading ? 'Extracting & Parsing Text...' : 'Upload & Parse Resume'}
            </button>
          </div>
        </form>
      </div>

      {/* Uploaded Resumes List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-navy-900">Saved Resumes ({resumes.length})</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(n => (
              <div key={n} className="p-5 rounded-2xl bg-white border border-slate-200 animate-pulse h-28"></div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            No resumes uploaded yet. Upload your resume above to start checking ATS compatibility.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {resumes.map((r) => (
              <div
                key={r.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-navy-900">{r.title}</span>
                    <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {r.file_type}
                    </span>
                    {r.is_primary && (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                        <Star className="w-3 h-3 mr-1 fill-current" /> Primary
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Uploaded on {new Date(r.uploaded_at).toLocaleDateString()} • {(r.file_size / 1024).toFixed(1)} KB
                  </p>

                  {/* Parsed skills tags */}
                  {r.parsed_skills && r.parsed_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {r.parsed_skills.slice(0, 6).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium">
                          {skill}
                        </span>
                      ))}
                      {r.parsed_skills.length > 6 && (
                        <span className="text-[10px] text-slate-400 font-medium self-center">
                          +{r.parsed_skills.length - 6} more skills detected
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => setPreviewResume(r)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center transition"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" /> View Parsed
                  </button>

                  {!r.is_primary && (
                    <button
                      onClick={() => handleSetPrimary(r.id)}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-semibold flex items-center transition"
                    >
                      <Star className="w-3.5 h-3.5 mr-1" /> Set Primary
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 transition"
                    title="Delete resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extracted Text Preview Modal */}
      {previewResume && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col p-6 shadow-2xl relative">
            <button
              onClick={() => setPreviewResume(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-navy-900 mb-1">
              Parsed Text: {previewResume.title}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Review how our server extracted content from your {previewResume.file_type.toUpperCase()} file.
            </p>

            <div className="flex-1 overflow-y-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-700">
              {previewResume.extracted_text || "No text extracted."}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPreviewResume(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

