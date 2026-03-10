export const scrollToProgress = (progress: number) => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
        top: progress * scrollHeight,
        behavior: 'smooth'
    });
};

export const SECTION_Z_PROGRESS = {
    hero: 0.1,
    solutions: 0.3,
    packages: 0.5,
    studio: 0.7,
    contact: 0.9
};
