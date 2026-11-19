const RAW_API_URL = import.meta.env.VITE_API_BASE_URL || '';
const BASE_URL = RAW_API_URL ? `${RAW_API_URL.replace(/\/+$/, '')}/api/v1` : '/api/v1';

export function getAuthHeaders() {
  const token = localStorage.getItem('nexora_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Token ${token}` } : {})
  };
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = options.isFormData 
    ? { ...(localStorage.getItem('nexora_token') ? { 'Authorization': `Token ${localStorage.getItem('nexora_token')}` } : {}) }
    : getAuthHeaders();

  const config = {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {})
    }
  };

  try {
    const response = await fetch(url, config);
    if (response.status === 204) {
      return null;
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes('/auth/login/')) {
        localStorage.removeItem('nexora_token');
        localStorage.removeItem('nexora_user');
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      }
      throw { status: response.status, data };
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export const api = {
  // Auth
  login: (credentials) => apiRequest('/auth/login/', { method: 'POST', body: JSON.stringify(credentials) }),
  registerCandidate: (data) => apiRequest('/auth/register/candidate/', { method: 'POST', body: JSON.stringify(data) }),
  registerRecruiter: (data) => apiRequest('/auth/register/recruiter/', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiRequest('/auth/me/'),
  changePassword: (data) => apiRequest('/auth/change-password/', { method: 'POST', body: JSON.stringify(data) }),
  googleOAuth: (credential) => apiRequest('/auth/google/', { method: 'POST', body: JSON.stringify({ credential }) }),
  githubOAuth: (code) => apiRequest('/auth/github/', { method: 'POST', body: JSON.stringify({ code }) }),
  logout: () => apiRequest('/auth/logout/', { method: 'POST' }),

  // Candidates
  getProfile: () => apiRequest('/candidates/profile/'),
  updateProfile: (data) => apiRequest('/candidates/profile/', { method: 'PATCH', body: JSON.stringify(data) }),

  // Resumes
  getResumes: () => apiRequest('/resumes/'),
  uploadResume: (formData) => apiRequest('/resumes/', { method: 'POST', body: formData, isFormData: true }),
  setPrimaryResume: (id) => apiRequest(`/resumes/${id}/set-primary/`, { method: 'POST' }),
  deleteResume: (id) => apiRequest(`/resumes/${id}/`, { method: 'DELETE' }),

  // ATS Checker
  getATSPresets: () => apiRequest('/ats/presets/'),
  checkATS: (payload, isFormData = false) => apiRequest('/ats/check/', { 
    method: 'POST', 
    body: isFormData ? payload : JSON.stringify(payload), 
    isFormData 
  }),
  improveResume: (payload) => apiRequest('/ats/improve/', { method: 'POST', body: JSON.stringify(payload) }),
  reEvaluateRevisedResume: (payload) => apiRequest('/ats/re-evaluate/', { method: 'POST', body: JSON.stringify(payload) }),
  saveImprovedToResumes: (payload) => apiRequest('/ats/save-to-resumes/', { method: 'POST', body: JSON.stringify(payload) }),
  downloadImprovedResume: async (payload) => {
    const token = localStorage.getItem('nexora_token');
    const res = await fetch(`${BASE_URL}/ats/download-improved/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Token ${token}` } : {})
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Download failed');
    return res.blob();
  },
  getATSHistory: () => apiRequest('/ats/history/'),
  getATSDetail: (id) => apiRequest(`/ats/${id}/`),

  // Jobs
  getJobs: (params = '') => apiRequest(`/jobs/${params ? `?${params}` : ''}`),
  getJobDetail: (id) => apiRequest(`/jobs/${id}/`),
  toggleSaveJob: (id) => apiRequest(`/jobs/${id}/save/`, { method: 'POST' }),
  getSavedJobs: () => apiRequest('/jobs/saved/'),

  // Recruiter Jobs
  getRecruiterJobs: () => apiRequest('/jobs/my-jobs/'),
  createJob: (data) => apiRequest('/jobs/my-jobs/', { method: 'POST', body: JSON.stringify(data) }),
  updateJob: (id, data) => apiRequest(`/jobs/my-jobs/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteJob: (id) => apiRequest(`/jobs/my-jobs/${id}/`, { method: 'DELETE' }),

  // Companies
  getCompanies: () => apiRequest('/companies/'),
  getMyCompany: () => apiRequest('/companies/my-company/'),
  updateMyCompany: (data) => apiRequest('/companies/my-company/', { method: 'PATCH', body: JSON.stringify(data) }),
  submitVerification: (data) => apiRequest('/companies/verify/', { method: 'POST', body: JSON.stringify(data) }),

  // Applications
  applyJob: (data) => apiRequest('/applications/apply/', { method: 'POST', body: JSON.stringify(data) }),
  getMyApplications: () => apiRequest('/applications/my-applications/'),
  withdrawApplication: (id) => apiRequest(`/applications/${id}/withdraw/`, { method: 'POST' }),
  getRecruiterApplications: (params = '') => apiRequest(`/applications/recruiter/${params ? `?${params}` : ''}`),
  updateApplicationStatus: (id, data) => apiRequest(`/applications/recruiter/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Matching
  getRecommendedJobs: (limit = 10) => apiRequest(`/matching/recommendations/?limit=${limit}`),
  getJobMatchDetail: (jobId) => apiRequest(`/matching/jobs/${jobId}/`),

  // Assessments
  getAssessmentCategories: () => apiRequest('/assessments/categories/'),
  getAssessments: (categorySlug = '') => apiRequest(`/assessments/${categorySlug ? `?category=${categorySlug}` : ''}`),
  getAssessmentForTaking: (id) => apiRequest(`/assessments/${id}/take/`),
  runCode: (payload) => apiRequest('/assessments/run-code/', { method: 'POST', body: JSON.stringify(payload) }),
  submitAssessment: (data) => apiRequest('/assessments/submit/', { method: 'POST', body: JSON.stringify(data) }),
  getMyAssessmentAttempts: () => apiRequest('/assessments/my-attempts/'),
  getAssessmentAttemptDetail: (id) => apiRequest(`/assessments/my-attempts/${id}/`),

  // Career GPS & Readiness
  getTargetRoles: () => apiRequest('/career/roles/'),
  getCareerResources: (category = '') => apiRequest(`/career/resources/${category ? `?category=${category}` : ''}`),
  getJobReadiness: (roleId = '') => apiRequest(`/career/readiness/${roleId ? `?role_id=${roleId}` : ''}`),
  setTargetRole: (roleId) => apiRequest('/career/readiness/', { method: 'POST', body: JSON.stringify({ target_role_id: roleId }) }),
  getRoadmap: (roleId = '') => apiRequest(`/career/roadmap/${roleId ? `?role_id=${roleId}` : ''}`),
  generateRoadmap: (data) => apiRequest('/career/roadmap/', { method: 'POST', body: JSON.stringify(data) }),
  toggleRoadmapStep: (stepId) => apiRequest(`/career/roadmap/steps/${stepId}/toggle/`, { method: 'PATCH' }),

  // RAG Assistant
  askAssistant: (data) => apiRequest('/assistant/chat/', { method: 'POST', body: JSON.stringify(data) }),
  getConversations: () => apiRequest('/assistant/conversations/'),
  getConversationDetail: (id) => apiRequest(`/assistant/conversations/${id}/`),
  renameConversation: (id, title) => apiRequest(`/assistant/conversations/${id}/`, { method: 'PATCH', body: JSON.stringify({ title }) }),
  deleteConversation: (id) => apiRequest(`/assistant/conversations/${id}/`, { method: 'DELETE' }),
  clearConversations: () => apiRequest('/assistant/conversations/', { method: 'DELETE' }),

  // Notifications
  // Notifications & Support
  getNotifications: () => apiRequest('/notifications/'),
  markNotificationRead: (id) => apiRequest(`/notifications/${id}/read/`, { method: 'PATCH' }),
  markAllNotificationsRead: () => apiRequest('/notifications/mark-all-read/', { method: 'POST' }),
  submitSupportTicket: (data) => apiRequest('/notifications/support/', { method: 'POST', body: JSON.stringify(data) }),

  // Moderation & Scam Shield
  reportJob: (data) => apiRequest('/moderation/reports/', { method: 'POST', body: JSON.stringify(data) }),
  getJobReports: () => apiRequest('/moderation/reports/'),
  resolveReport: (id, data) => apiRequest(`/moderation/reports/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAdminVerifications: () => apiRequest('/moderation/verifications/'),
  actOnVerification: (id, data) => apiRequest(`/moderation/verifications/${id}/action/`, { method: 'POST', body: JSON.stringify(data) }),
  getAdminRecruiters: (status = '', search = '') => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    const q = params.toString();
    return apiRequest(`/moderation/recruiters/${q ? `?${q}` : ''}`);
  },
  actOnRecruiter: (id, data) => apiRequest(`/moderation/recruiters/${id}/action/`, { method: 'POST', body: JSON.stringify(data) }),
  getAdminJobs: (status = '', search = '') => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    const q = params.toString();
    return apiRequest(`/moderation/jobs/${q ? `?${q}` : ''}`);
  },
  actOnJob: (id, data) => apiRequest(`/moderation/jobs/${id}/action/`, { method: 'POST', body: JSON.stringify(data) }),
  getAdminUsers: (role = '', status = '', search = '') => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    const q = params.toString();
    return apiRequest(`/moderation/users/${q ? `?${q}` : ''}`);
  },
  actOnUser: (id, data) => apiRequest(`/moderation/users/${id}/action/`, { method: 'POST', body: JSON.stringify(data) }),
  getAdminStats: () => apiRequest('/moderation/stats/'),
  getAuditLogs: () => apiRequest('/moderation/audit-logs/'),
};

