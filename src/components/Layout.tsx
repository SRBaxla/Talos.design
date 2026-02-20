import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GlobalBackground } from './GlobalBackground';

export function Layout() {
    return (
        <div className="flex flex-col min-h-screen relative">
            <GlobalBackground />

            {/* The rest of the content needs to be positioned above the fixed background */}
            <div className="relative z-10 flex flex-col min-h-screen w-full">
                <Navbar />
                <main className="flex-grow flex flex-col pt-24">
                    {/* pt-24 accounts for the fixed navbar height */}
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    );
}
