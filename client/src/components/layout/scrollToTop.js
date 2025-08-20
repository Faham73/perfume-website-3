import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation(); // This gets the current path automatically

  useEffect(() => {
    // This will run every time the pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // or use 'auto' for instant scroll
    });
  }, [pathname]); // The dependency array - effect runs when pathname changes

  return null; // This component doesn't render anything
};

export default ScrollToTop;