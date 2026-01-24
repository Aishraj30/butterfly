'use client';
import { useEffect } from 'react';

export default function SmoothScroll() {
    useEffect(() => {
        // Enable native smooth scrolling for the entire page
        document.documentElement.style.scrollBehavior = 'smooth';
        
        return () => {
            // Cleanup: reset scroll behavior when component unmounts
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, [])

    return null
}
