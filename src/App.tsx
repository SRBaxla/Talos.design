import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Projects from './pages/Projects';
import ProjectPresence from './pages/ProjectPresence';
import ProjectAutomation from './pages/ProjectAutomation';
import ProjectCustom from './pages/ProjectCustom';
import AboutUs from './pages/AboutUs';
import ServiceWebDesign from './pages/ServiceWebDesign';
import ServiceChatbots from './pages/ServiceChatbots';
import ServiceAutomation from './pages/ServiceAutomation';
import Legal from './pages/Legal';
import OfferHospitality from './pages/OfferHospitality';
import OfferEcommerce from './pages/OfferEcommerce';
import OfferProfessional from './pages/OfferProfessional';

// Admin
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminProjects from './admin/pages/AdminProjects';
import AdminCaseStudies from './admin/pages/AdminCaseStudies';
import AdminSettings from './admin/pages/AdminSettings';
import AdminInquiries from './admin/pages/AdminInquiries';
import AdminInvoices from './admin/pages/AdminInvoices';
import ProjectDetail from './admin/pages/ProjectDetail';
import CaseStudyDetail from './admin/pages/CaseStudyDetail';

// Client Portal
import PortalLogin from './portal/PortalLogin';
import PortalDashboard from './portal/PortalDashboard';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public Site */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="about" element={<About />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="contact" element={<Contact />} />
          <Route path="careers" element={<Careers />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/presence" element={<ProjectPresence />} />
          <Route path="projects/automation" element={<ProjectAutomation />} />
          <Route path="projects/custom" element={<ProjectCustom />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="services/web-design" element={<ServiceWebDesign />} />
          <Route path="services/chatbots" element={<ServiceChatbots />} />
          <Route path="services/automation" element={<ServiceAutomation />} />
          <Route path="offers/hospitality" element={<OfferHospitality />} />
          <Route path="offers/ecommerce" element={<OfferEcommerce />} />
          <Route path="offers/professional" element={<OfferProfessional />} />
          <Route path="legal" element={<Legal />} />
        </Route>

        {/* Client Portal */}
        <Route path="/portal" element={<PortalLogin />} />
        <Route path="/portal/dashboard" element={<PortalDashboard />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="case-studies" element={<AdminCaseStudies />} />
          <Route path="case-studies/:id" element={<CaseStudyDetail />} />
          <Route path="inquiries" element={<AdminInquiries />} />
          <Route path="invoices" element={<AdminInvoices />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
