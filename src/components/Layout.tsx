import { Outlet, useLocation, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollExperience } from './ScrollExperience';
import logo from '../assets/bitmap.png';

function MinimalHeader() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-x-0 border-t-0 border-b border-b-[var(--border-color)]" style={{ borderRadius: 0, padding: '0.75rem 0' }}>
            <div className="container flex items-center">
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Talos.design" className="h-8" />
                </Link>
            </div>
        </nav>
    );
}

export function Layout() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="flex flex-col min-h-screen relative">
            <ScrollExperience />

            <div className="flex flex-col min-h-screen w-full">
                {isHome ? <Navbar /> : <MinimalHeader />}
                <main className="flex-grow flex flex-col pt-24">
                    <Outlet />
                </main>
                {!isHome && <Footer />}
            </div>
        </div>
    );
}
