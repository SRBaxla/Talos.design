import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter basename="/Talos.design/">
      <Routes>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
