import { useEffect, useState } from "react";

const ScrollProgressBar = ({ isVisible }: { isVisible: boolean }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`absolute bottom-0 left-0 w-full h-1 bg-gray-200 z-50 ${!isVisible ? 'hidden' : ''}`}>
      <div className="h-full bg-primary" style={{ width: `${scrollProgress}%` }} />
    </div>
  );
};

export default ScrollProgressBar;
