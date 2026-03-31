import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import RSIOneSignup from './Signup';
import RSIOneLogin from './Login';
import RSITwoStepVerification from './Verify';
import RSIForgotPassword from './ForgotPass';
import RSIPricing from './Pricing';
import RSIPaymentOptions from './PaymentOption';
import RSIPaymentGateway from './AddPayment';
import RSINextSteps from './NextSteps';
import RSIDashboard from './RSIDashboard';
import RSIFlightLogModal from './addflightlog';
import RSIYachtUsageModal from './addyatchlog';
import SignupSuccessWindow from './signup_success';
import PasswordResetSuccess from './password_reset_success';
import LogSuccessWindow from './signin_success';
import NotificationsPanel from './notification';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signup" element={<RSIOneSignup />} />
          <Route path="/signup-success" element={<SignupSuccessWindow />} />
          <Route path="/login" element={<RSIOneLogin />} />
          <Route path="/verify" element={<RSITwoStepVerification />} />
          <Route path="/forgot" element={<RSIForgotPassword />} />
          <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
          <Route path="/signin-success" element={<LogSuccessWindow />} />
          <Route path="/notifications" element={<NotificationsPanel />} />
          <Route path="/pricing" element={
            <ProtectedRoute>
              <RSIPricing />
            </ProtectedRoute>
          } />
          <Route path="/payment-options" element={
            <ProtectedRoute>
              <RSIPaymentOptions />
            </ProtectedRoute>
          } />
          <Route path="/paymentoption" element={
            <ProtectedRoute>
              <RSIPaymentOptions />
            </ProtectedRoute>
          } />
          <Route path="/add-payment" element={
            <ProtectedRoute>
              <RSIPaymentGateway />
            </ProtectedRoute>
          } />
          <Route path="/addpayment" element={
            <ProtectedRoute>
              <RSIPaymentGateway />
            </ProtectedRoute>
          } />
          <Route path="/next-steps" element={
            <ProtectedRoute>
              <RSINextSteps />
            </ProtectedRoute>
          } />
          <Route path="/nextsteps" element={
            <ProtectedRoute>
              <RSINextSteps />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <RSIDashboard />
            </ProtectedRoute>
          } />
          <Route path="/addflightlog" element={
            <ProtectedRoute>
              <RSIFlightLogModal />
            </ProtectedRoute>
          } />
          <Route path="/addyatchlog" element={
            <ProtectedRoute>
              <RSIYachtUsageModal />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/signup" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
