import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router';
import { Layout } from './components/Layout';

// Eager imports for static prerendering pass
import Home from './pages/Home';
import Expertise from './pages/Expertise';
import Insights from './pages/Insights';
import Services from './pages/Services';
import Studio from './pages/Studio';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Projects from './pages/Projects';
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

export function render(url: string): { html: string } {
  const html = renderToString(
    <MemoryRouter initialEntries={[url]}>
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
      </Routes>
    </MemoryRouter>
  );

  return { html };
}

export { getRouteMetadata, PUBLIC_ROUTE_METADATA } from './data/routeMetadata';
export type { RouteMetadata } from './data/routeMetadata';
export { renderStructuredDataHtml } from './components/StructuredData';
