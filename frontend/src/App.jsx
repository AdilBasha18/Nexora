import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Common Layout components
import AnnouncementBar from './components/common/AnnouncementBar';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import WelcomeAuthModal from './components/common/WelcomeAuthModal';

// Public Pages
import HomePage from './pages/public/HomePage';
import JobsPage from './pages/public/JobsPage';
import JobDetailPage from './pages/public/JobDetailPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForEmployersPage from './pages/public/ForEmployersPage';
import AboutPage from './pages/public/AboutPage';
import PrivacyPage from './pages/public/PrivacyPage';
import TermsPage from './pages/public/TermsPage';
import ResponsibleAIPage from './pages/public/ResponsibleAIPage';

// Candidate Dashboard Pages
import CandidateLayout from './pages/candidate/CandidateLayout';
import CandidateOverview from './pages/candidate/CandidateOverview';
import CandidateProfilePage from './pages/candidate/CandidateProfilePage';
import CandidateProfileWizardPage from './pages/candidate/CandidateProfileWizardPage';
import CandidateResumesPage from './pages/candidate/CandidateResumesPage';
import ATSCheckerPage from './pages/candidate/ATSCheckerPage';
import CandidateRecommendedJobsPage from './pages/candidate/CandidateRecommendedJobsPage';
import CandidateSavedJobsPage from './pages/candidate/CandidateSavedJobsPage';
import CandidateApplicationsPage from './pages/candidate/CandidateApplicationsPage';
import CandidateAssessmentsPage from './pages/candidate/CandidateAssessmentsPage';
import AssessmentHistoryPage from './pages/candidate/AssessmentHistoryPage';
import TakeAssessmentPage from './pages/candidate/TakeAssessmentPage';
import AssessmentResultPage from './pages/candidate/AssessmentResultPage';
import CareerGPSPage from './pages/candidate/CareerGPSPage';
import JobReadinessPage from './pages/candidate/JobReadinessPage';
import AIAssistantPage from './pages/candidate/AIAssistantPage';
import CandidateNotificationsPage from './pages/candidate/CandidateNotificationsPage';

// Recruiter Dashboard Pages
import RecruiterLayout from './pages/recruiter/RecruiterLayout';
import RecruiterOverview from './pages/recruiter/RecruiterOverview';
import PostJobPage from './pages/recruiter/PostJobPage';
import ManageJobsPage from './pages/recruiter/ManageJobsPage';
import RecruiterApplicantsPage from './pages/recruiter/RecruiterApplicantsPage';
import CompanyProfilePage from './pages/recruiter/CompanyProfilePage';

// Admin Operations Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import CompanyVerificationsPage from './pages/admin/CompanyVerificationsPage';
import JobModerationPage from './pages/admin/JobModerationPage';
import ScamReportsPage from './pages/admin/ScamReportsPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';

// Public Layout wrapper with AnnouncementBar + Navbar + Footer + Welcome Modal
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Navbar />
      <WelcomeAuthModal />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

// Protected Route Guard
function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="p-16 text-center text-xs text-slate-500">Checking credentials...</div>;
  }

  if (!isAuthenticated) {
    const returnPath = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnPath}`} replace />;
  }

  if (role === 'ADMIN' && user?.role !== 'ADMIN' && !user?.is_superuser) {
    return <Navigate to="/" replace />;
  }

  if (role === 'RECRUITER' && user?.role !== 'RECRUITER' && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/ats-checker" element={<ProtectedRoute><ATSCheckerPage /></ProtectedRoute>} />
            <Route path="/career-gps" element={<ProtectedRoute><CareerGPSPage /></ProtectedRoute>} />
            <Route path="/assessments" element={<CandidateAssessmentsPage />} />
            <Route path="/assessments/history" element={<ProtectedRoute><AssessmentHistoryPage /></ProtectedRoute>} />
            <Route path="/assessments/:id/take" element={<ProtectedRoute><TakeAssessmentPage /></ProtectedRoute>} />
            <Route path="/assessments/results/:id" element={<ProtectedRoute><AssessmentResultPage /></ProtectedRoute>} />
            <Route path="/assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
            <Route path="/for-employers" element={<ForEmployersPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/responsible-ai" element={<ResponsibleAIPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Candidate Dashboard */}
          <Route 
            path="/candidate" 
            element={
              <ProtectedRoute>
                <CandidateLayout />
              </ProtectedRoute>
            }
          >
            <Route path="overview" element={<CandidateOverview />} />
            <Route path="profile" element={<CandidateProfilePage />} />
            <Route path="setup-profile" element={<CandidateProfileWizardPage />} />
            <Route path="resumes" element={<CandidateResumesPage />} />
            <Route path="recommended-jobs" element={<CandidateRecommendedJobsPage />} />
            <Route path="saved-jobs" element={<CandidateSavedJobsPage />} />
            <Route path="applications" element={<CandidateApplicationsPage />} />
            <Route path="readiness" element={<JobReadinessPage />} />
            <Route path="assessments/history" element={<AssessmentHistoryPage />} />
            <Route path="assessments/results/:id" element={<AssessmentResultPage />} />
            <Route path="notifications" element={<CandidateNotificationsPage />} />
          </Route>

          {/* Recruiter Dashboard */}
          <Route 
            path="/recruiter" 
            element={
              <ProtectedRoute role="RECRUITER">
                <RecruiterLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<RecruiterOverview />} />
            <Route path="jobs/new" element={<PostJobPage />} />
            <Route path="jobs" element={<ManageJobsPage />} />
            <Route path="applicants" element={<RecruiterApplicantsPage />} />
            <Route path="company" element={<CompanyProfilePage />} />
          </Route>

          {/* Admin Operations */}
          <Route 
            path="/admin-portal" 
            element={
              <ProtectedRoute role="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="verifications" element={<CompanyVerificationsPage />} />
            <Route path="jobs" element={<JobModerationPage />} />
            <Route path="reports" element={<ScamReportsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
          </Route>

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

