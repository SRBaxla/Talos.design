import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { ScrollExperience } from './ScrollExperience';

export function Layout() {
    return (
        <div className="flex flex-col min-h-screen relative">
            <ScrollExperience />

            {/* Content is placed here; background is provided by pages like Home.tsx */}
            <div className="flex flex-col min-h-screen w-full">
                <Navbar />
                <main className="flex-grow flex flex-col pt-24">
                    {/* pt-24 accounts for the fixed navbar height */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
