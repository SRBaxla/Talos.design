import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { Layout } from './components/Layout';

// ── Eagerly loaded (above-the-fold, critical path) ──────────────────────────
import Home from './pages/Home';

// ── Public pages — lazy loaded ───────────────────────────────────────────────
const Services = lazy(() => import('./pages/Services'));
const Studio = lazy(() => import('./pages/Studio'));
const Contact = lazy(() => import('./pages/Contact'));
const Careers = lazy(() => import('./pages/Careers'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectPresence = lazy(() => import('./pages/ProjectPresence'));
const ProjectAutomation = lazy(() => import('./pages/ProjectAutomation'));
const ProjectCustom = lazy(() => import('./pages/ProjectCustom'));
const ServiceWebDesign = lazy(() => import('./pages/ServiceWebDesign'));
const ServiceChatbots = lazy(() => import('./pages/ServiceChatbots'));
const ServiceAutomation = lazy(() => import('./pages/ServiceAutomation'));
const OfferHospitality = lazy(() => import('./pages/OfferHospitality'));
const OfferEcommerce = lazy(() => import('./pages/OfferEcommerce'));
const OfferProfessional = lazy(() => import('./pages/OfferProfessional'));
const Legal = lazy(() => import('./pages/Legal'));
const AboutUs = lazy(() => import('./pages/AboutUs'));

// ── Admin panel — lazy loaded as a group ────────────────────────────────────
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/pages/AdminDashboard'));
const AdminProjects = lazy(() => import('./admin/pages/AdminProjects'));
const AdminTeam = lazy(() => import('./admin/pages/AdminTeam'));
const AdminCaseStudies = lazy(() => import('./admin/pages/AdminCaseStudies'));
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

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public Site */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="about" element={<Studio />} />
            <Route path="contact" element={<Contact />} />
            <Route path="careers" element={<Careers />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/presence" element={<ProjectPresence />} />
            <Route path="projects/automation" element={<ProjectAutomation />} />
            <Route path="projects/custom" element={<ProjectCustom />} />
            <Route path="services/web-design" element={<ServiceWebDesign />} />
            <Route path="services/chatbots" element={<ServiceChatbots />} />
            <Route path="services/automation" element={<ServiceAutomation />} />
            <Route path="offers/hospitality" element={<OfferHospitality />} />
            <Route path="offers/ecommerce" element={<OfferEcommerce />} />
            <Route path="offers/professional" element={<OfferProfessional />} />
            <Route path="legal" element={<Legal />} />
            <Route path="about-us" element={<AboutUs />} />
          </Route>

          {/* Client Portal */}
          <Route path="/portal" element={<PortalLogin />} />
          <Route path="/portal/dashboard" element={<PortalDashboard />} />
          <Route path="/portal/profile" element={<PortalProfile />} />

          {/* Admin Panel */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
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
    </BrowserRouter>
  );
}

export default App;
