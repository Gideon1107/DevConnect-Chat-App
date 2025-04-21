import { useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";

const BackToTop = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    // Use useEffect to handle scroll events properly
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        // Add event listener
        window.addEventListener('scroll', handleScroll);

        // Initial check
        handleScroll();

        // Clean up
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleScrollToTop = () => {
        // Add click effect
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 300);

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div
            className={`fixed z-50 bottom-8 right-8 transition-all duration-500 ease-in-out transform ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}
            onClick={handleScrollToTop}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Scroll to top"
        >
            <div
                className={`flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 shadow-lg cursor-pointer transition-all duration-300 ${isHovered ? 'bg-blue-600 shadow-blue-500/30 scale-110' : 'shadow-blue-500/20'} ${isClicked ? 'scale-90' : ''}`}
                style={{ animation: showBackToTop && !isClicked ? 'pulse 2s infinite, float 3s ease-in-out infinite' : 'none' }}
            >
                <IoIosArrowUp
                    size={24}
                    className="text-white transition-transform duration-300 ease-in-out"
                    style={{ transform: isHovered ? 'translateY(-2px)' : 'translateY(0)' }}
                />
            </div>
            {/* Tooltip */}
            <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-blue-600 text-white text-xs py-1 px-2 rounded transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                Back to top
            </div>

            {/* Ripple effect */}
            {isClicked && (
                <div className="absolute inset-0 pointer-events-none">
                    <span className="absolute inset-0 rounded-full bg-blue-400 opacity-70" style={{ animation: 'ripple 0.6s ease-out forwards' }}></span>
                </div>
            )}
        </div>
    );
}

export default BackToTop