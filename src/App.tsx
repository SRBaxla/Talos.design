import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { Layout } from './components/Layout';
import { LoadingScreen } from './components/LoadingScreen';
import { RouteMetadataManager } from './components/RouteMetadataManager';

// ── Public pages — eagerly imported for seamless SSG hydration ─────────────
import Home from './pages/Home';
import Services from './pages/Services';
import Studio from './pages/Studio';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Projects from './pages/Projects';
import Expertise from './pages/Expertise';
import Insights from './pages/Insights';
import ProjectPresence from './pages/ProjectPresence';
import ProjectAutomation from './pages/ProjectAutomation';
import ProjectCustom from './pages/ProjectCustom';
import SolutionMedilife from './pages/SolutionMedilife';
import ServiceWebDesign from './pages/ServiceWebDesign';
import ServiceChatbots from './pages/ServiceChatbots';
import ServiceAutomation from './pages/ServiceAutomation';
import SolutionHospitality from './pages/SolutionHospitality';
import SolutionEcommerce from './pages/SolutionEcommerce';
import SolutionAppointments from './pages/SolutionAppointments';
import Solutions from './pages/Solutions';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';

// ── Admin panel — lazy loaded as a group ────────────────────────────────────
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminProjects = lazy(() => import('./admin/pages/AdminProjects'));
const AdminTeam = lazy(() => import('./admin/pages/AdminTeam'));
const AdminCaseStudies = lazy(() => import('./admin/pages/AdminCaseStudies'));
const AdminInsights = lazy(() => import('./admin/pages/AdminInsights'));
const AdminInsightsEditor = lazy(() => import('./admin/pages/AdminInsightsEditor'));
const AdminComments = lazy(() => import('./admin/pages/AdminComments'));
const AdminSettings = lazy(() => import('./admin/pages/AdminSettings'));
const AdminInquiries = lazy(() => import('./admin/pages/AdminInquiries'));
const AdminLeads = lazy(() => import('./admin/pages/AdminLeads'));
const AdminInvoices = lazy(() => import('./admin/pages/AdminInvoices'));
const ProjectDetail = lazy(() => import('./admin/pages/ProjectDetail'));
const CaseStudyDetail = lazy(() => import('./admin/pages/CaseStudyDetail'));
const AdminProfile = lazy(() => import('./admin/pages/AdminProfile'));

// ── Client portal — lazy loaded ──────────────────────────────────────────────
const PortalLogin = lazy(() => import('./portal/PortalLogin'));
const PortalDashboard = lazy(() => import('./portal/PortalDashboard'));
const PortalProfile = lazy(() => import('./portal/PortalProfile'));

// Minimal fallback — invisible, keeps layout stable (no spinner flash)
const PageFallback = () => (
  <div style={{ minHeight: '60vh' }} aria-hidden="true" />
);

export function AppRoutes({ isInitializing, onInitComplete }: { isInitializing?: boolean; onInitComplete?: () => void }) {
  return (
    <>
      <RouteMetadataManager />
      {isInitializing && onInitComplete && <LoadingScreen onComplete={onInitComplete} />}
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="expertise" element={<Expertise />} />
            <Route path="impact" element={<Navigate to="/services" replace />} />
            <Route path="insights" element={<Insights />} />
            <Route path="services" element={<Services />} />
            <Route path="about" element={<Studio />} />
            <Route path="contact" element={<Contact />} />
            <Route path="careers" element={<Careers />} />
            <Route path="packages" element={<Projects />} />
            <Route path="packages/presence" element={<ProjectPresence />} />
            <Route path="packages/automation" element={<ProjectAutomation />} />
            <Route path="packages/custom" element={<ProjectCustom />} />
            <Route path="solutions" element={<Solutions />} />
            <Route path="solutions/medilife" element={<SolutionMedilife />} />
            <Route path="services/web-design" element={<ServiceWebDesign />} />
            <Route path="services/chatbots" element={<ServiceChatbots />} />
            <Route path="services/automation" element={<ServiceAutomation />} />
            <Route path="solutions/hospitality" element={<SolutionHospitality />} />
            <Route path="solutions/ecommerce" element={<SolutionEcommerce />} />
            <Route path="solutions/appointments" element={<SolutionAppointments />} />
            <Route path="legal" element={<Legal />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Client Portal */}
          <Route path="/portal" element={<PortalLogin />} />
          <Route path="/portal/dashboard" element={<PortalDashboard />} />
          <Route path="/portal/profile" element={<PortalProfile />} />

          {/* Admin Panel */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="insights" element={<AdminInsights />} />
            <Route path="insights/editor" element={<AdminInsightsEditor />} />
            <Route path="insights/editor/:id" element={<AdminInsightsEditor />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="case-studies" element={<AdminCaseStudies />} />
            <Route path="case-studies/:id" element={<CaseStudyDetail />} />
            <Route path="team" element={<AdminTeam />} />
            <Route path="inquiries" element={<AdminInquiries />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="invoices" element={<AdminInvoices />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

function shouldShowSplash(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const isClientOnly =
      window.location.pathname.startsWith('/admin') ||
      window.location.pathname.startsWith('/portal');
    if (isClientOnly) return false;
    return !sessionStorage.getItem('talos_splash_shown');
  } catch {
    return false;
  }
}

function App() {
  const [isInitializing, setIsInitializing] = useState(shouldShowSplash);

  const handleInitComplete = () => {
    try {
      sessionStorage.setItem('talos_splash_shown', 'true');
    } catch {
      // ignore storage restrictions
    }
    setIsInitializing(false);
  };

  return (
    <BrowserRouter>
      <AppRoutes isInitializing={isInitializing} onInitComplete={handleInitComplete} />
    </BrowserRouter>
  );
}

export default App;

