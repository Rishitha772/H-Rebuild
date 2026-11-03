import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import TasksList from './pages/TasksList';
import TaskDetail from './pages/TaskDetail';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import MyApplications from './pages/candidate/MyApplications';
import CandidateProfile from './pages/candidate/CandidateProfile';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import MyTasks from './pages/recruiter/MyTasks';
import CreateEditTask from './pages/recruiter/CreateEditTask';
import ApplicantManagement from './pages/recruiter/ApplicantManagement';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tasks" element={<TasksList />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />

            {/* Candidate Protected Routes */}
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute requiredRole="candidate">
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/applications"
              element={
                <ProtectedRoute requiredRole="candidate">
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/profile"
              element={
                <ProtectedRoute requiredRole="candidate">
                  <CandidateProfile />
                </ProtectedRoute>
              }
            />

            {/* Recruiter Protected Routes */}
            <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/tasks"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <MyTasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/tasks/new"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <CreateEditTask />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/tasks/:id/edit"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <CreateEditTask />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/applicants"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <ApplicantManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/tasks/:id/applicants"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <ApplicantManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/profile"
              element={
                <ProtectedRoute requiredRole="recruiter">
                  <RecruiterProfile />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default App;
