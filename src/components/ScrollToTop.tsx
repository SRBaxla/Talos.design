import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            // Use a slight timeout to ensure route transition and any layout shifts are complete
            // and to override snap-scroll behaviors from previous pages.
            const timer = setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'instant'
                });
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            }, 10);
            return () => clearTimeout(timer);
        }
    }, [pathname, hash]);

    return null;
}
