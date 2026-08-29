import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EmergencyBanner } from './components/EmergencyBanner';
import { ToastContainer } from './components/Toast';
import { RespondModal } from './components/RespondModal';
import { CertificateModal } from './components/CertificateModal';
import { DonorContactModal } from './components/DonorContactModal';
import { NotificationPopover } from './components/NotificationPopover';

// Page Views
import { HomeView } from './views/HomeView';
import { FindDonorView } from './views/FindDonorView';
import { DonorRegistrationView } from './views/DonorRegistrationView';
import { BloodRequestView } from './views/BloodRequestView';
import { EmergencyAlertsView } from './views/EmergencyAlertsView';
import { DonorDashboardView } from './views/DonorDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AboutView } from './views/AboutView';
import { BloodCompatibilityMatrix } from './components/BloodCompatibilityMatrix';
import { DonorEligibilityQuiz } from './components/DonorEligibilityQuiz';
import { AuthModal } from './components/AuthModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'find-donor':
        return <FindDonorView />;
      case 'register-donor':
        return <DonorRegistrationView />;
      case 'request-blood':
        return <BloodRequestView />;
      case 'emergency-alerts':
        return <EmergencyAlertsView />;
      case 'donor-dashboard':
        return <DonorDashboardView />;
      case 'admin-dashboard':
        return <AdminDashboardView />;
      case 'about':
      case 'download-apk':
        return <AboutView />;
      case 'compatibility-guide':
        return (
          <div className="py-12 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <BloodCompatibilityMatrix />
            </div>
          </div>
        );
      case 'eligibility-checker':
        return (
          <div className="py-12 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <DonorEligibilityQuiz />
            </div>
          </div>
        );
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-red-500 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Urgent Emergency Banner (if any Code Red requests) */}
      <EmergencyBanner />

      {/* Main Sticky Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Floating Components */}
      <AuthModal />
      <ApkDownloadModal />
      <RespondModal />
      <CertificateModal />
      <DonorContactModal />
      <NotificationPopover />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
