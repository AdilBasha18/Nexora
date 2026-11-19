import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Common Layout components (Eagerly Loaded for Instant Structure)
import AnnouncementBar from './components/common/AnnouncementBar';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import WelcomeAuthModal from './components/common/WelcomeAuthModal';
import SuspenseFallback from './components/common/SuspenseFallback';

// Public Pages (Code-Split / Lazy Loaded)
const HomePage = lazy(() => import('./pages/public/HomePage'));
const JobsPage = lazy(() => import('./pages/public/JobsPage'));
const JobDetailPage = lazy(() => import('./pages/public/JobDetailPage'));
const AuthPage = lazy(() => import('./pages/public/AuthPage'));
const ForEmployersPage = lazy(() => import('./pages/public/ForEmployersPage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const PrivacyPage = lazy(() => import('./pages/public/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/public/TermsPage'));
const ResponsibleAIPage = lazy(() => import('./pages/public/ResponsibleAIPage'));
const ContactSupportPage = lazy(() => import('./pages/public/ContactSupportPage'));

// Candidate Dashboard Pages (Code-Split / Lazy Loaded)
import CandidateLayout from './pages/candidate/CandidateLayout';
const CandidateOverview = lazy(() => import('./pages/candidate/CandidateOverview'));
const CandidateProfilePage = lazy(() => import('./pages/candidate/CandidateProfilePage'));
const CandidateProfileWizardPage = lazy(() => import('./pages/candidate/CandidateProfileWizardPage'));
const CandidateResumesPage = lazy(() => import('./pages/candidate/CandidateResumesPage'));
const ATSCheckerPage = lazy(() => import('./pages/candidate/ATSCheckerPage'));
const CandidateRecommendedJobsPage = lazy(() => import('./pages/candidate/CandidateRecommendedJobsPage'));
const CandidateSavedJobsPage = lazy(() => import('./pages/candidate/CandidateSavedJobsPage'));
const CandidateApplicationsPage = lazy(() => import('./pages/candidate/CandidateApplicationsPage'));
const CandidateAssessmentsPage = lazy(() => import('./pages/candidate/CandidateAssessmentsPage'));
const AssessmentHistoryPage = lazy(() => import('./pages/candidate/AssessmentHistoryPage'));
const TakeAssessmentPage = lazy(() => import('./pages/candidate/TakeAssessmentPage'));
const AssessmentResultPage = lazy(() => import('./pages/candidate/AssessmentResultPage'));
const CareerGPSPage = lazy(() => import('./pages/candidate/CareerGPSPage'));
const JobReadinessPage = lazy(() => import('./pages/candidate/JobReadinessPage'));
const AIAssistantPage = lazy(() => import('./pages/candidate/AIAssistantPage'));
const CandidateNotificationsPage = lazy(() => import('./pages/candidate/CandidateNotificationsPage'));

// Recruiter Dashboard Pages (Code-Split / Lazy Loaded)
import RecruiterLayout from './pages/recruiter/RecruiterLayout';
const RecruiterOverview = lazy(() => import('./pages/recruiter/RecruiterOverview'));
const PostJobPage = lazy(() => import('./pages/recruiter/PostJobPage'));
const ManageJobsPage = lazy(() => import('./pages/recruiter/ManageJobsPage'));
const RecruiterApplicantsPage = lazy(() => import('./pages/recruiter/RecruiterApplicantsPage'));
const CompanyProfilePage = lazy(() => import('./pages/recruiter/CompanyProfilePage'));

// Admin Operations Pages (Code-Split / Lazy Loaded)
import AdminLayout from './pages/admin/AdminLayout';
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const CompanyVerificationsPage = lazy(() => import('./pages/admin/CompanyVerificationsPage'));
const RecruiterApprovalsPage = lazy(() => import('./pages/admin/RecruiterApprovalsPage'));
const JobModerationPage = lazy(() => import('./pages/admin/JobModerationPage'));
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const ScamReportsPage = lazy(() => import('./pages/admin/ScamReportsPage'));
const AuditLogsPage = lazy(() => import('./pages/admin/AuditLogsPage'));

// Public Layout wrapper with Navbar only (Footer is on Homepage)
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
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

  // Determine user's primary dashboard for graceful unauthorized role redirects
  const userDashboard = 
    user?.role === 'ADMIN' || user?.is_superuser ? '/admin-portal' :
    user?.role === 'RECRUITER' ? '/recruiter/dashboard' :
    '/candidate/overview';

  if (role === 'ADMIN' && user?.role !== 'ADMIN' && !user?.is_superuser) {
    return <Navigate to={userDashboard} replace />;
  }

  if (role === 'RECRUITER' && user?.role !== 'RECRUITER' && user?.role !== 'ADMIN' && !user?.is_superuser) {
    return <Navigate to={userDashboard} replace />;
  }

  if (role === 'CANDIDATE' && user?.role !== 'CANDIDATE' && user?.role !== 'ADMIN' && !user?.is_superuser) {
    return <Navigate to={userDashboard} replace />;
  }

  return children;
}

// Helper to route /assistant properly based on role
function AssistantRouteDispatcher() {
  const { user } = useAuth();
  if (user?.role === 'RECRUITER') {
    return <Navigate to="/recruiter/assistant" replace />;
  }
  return <AIAssistantPage />;
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<SuspenseFallback />}>
              <Routes>
          
          {/* Redirect legacy /welcome to home */}
          <Route path="/welcome" element={<Navigate to="/" replace />} />

          {/* Dedicated Full-Screen Assessment Test Environment (No Public Header / Footer) */}
          <Route 
            path="/assessments/:id/take" 
            element={
              <ProtectedRoute>
                <TakeAssessmentPage />
              </ProtectedRoute>
            } 
          />

          {/* Focused Internal Workspaces – WITH Dashboard Sidebar, NO Public Navbar / Footer */}
          <Route 
            element={
              <ProtectedRoute role="CANDIDATE">
                <CandidateLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/ats-checker" element={<ATSCheckerPage />} />
            <Route path="/career-gps" element={<CareerGPSPage />} />
            <Route path="/assessments" element={<CandidateAssessmentsPage />} />
            <Route path="/assessments/history" element={<AssessmentHistoryPage />} />
            <Route path="/assessments/results/:id" element={<AssessmentResultPage />} />
            <Route path="/assistant" element={<AssistantRouteDispatcher />} />
          </Route>

          {/* Public Website Routes – WITH Navbar */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/jobs" 
              element={
                <ProtectedRoute>
                  <JobsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobs/:id" 
              element={
                <ProtectedRoute>
                  <JobDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/for-employers" element={<ForEmployersPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact-support" element={<ContactSupportPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/responsible-ai" element={<ResponsibleAIPage />} />
          </Route>

          {/* Auth Pages – Full-screen, NO Navbar/Footer */}
          <Route path="/login" element={<AuthPage defaultMode="signin" />} />
          <Route path="/register" element={<AuthPage defaultMode="signup" />} />

          {/* Candidate Dashboard */}
          <Route 
            path="/candidate" 
            element={
              <ProtectedRoute role="CANDIDATE">
                <CandidateLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<CandidateOverview />} />
            <Route path="profile" element={<CandidateProfilePage />} />
            <Route path="setup-profile" element={<CandidateProfileWizardPage />} />
            <Route path="resumes" element={<Navigate to="/ats-checker" replace />} />
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
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<RecruiterOverview />} />
            <Route path="jobs/new" element={<PostJobPage />} />
            <Route path="jobs" element={<ManageJobsPage />} />
            <Route path="applicants" element={<RecruiterApplicantsPage />} />
            <Route path="assistant" element={<AIAssistantPage role="RECRUITER" />} />
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
            <Route path="recruiters" element={<RecruiterApprovalsPage />} />
            <Route path="jobs" element={<JobModerationPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="verifications" element={<CompanyVerificationsPage />} />
            <Route path="reports" element={<ScamReportsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
          </Route>

          {/* Convenient Route Aliases to Prevent Navigation Redirect Loops */}
          <Route path="/recruiter/overview" element={<Navigate to="/recruiter/dashboard" replace />} />
          <Route path="/admin/overview" element={<Navigate to="/admin-portal" replace />} />
          <Route path="/admin" element={<Navigate to="/admin-portal" replace />} />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
