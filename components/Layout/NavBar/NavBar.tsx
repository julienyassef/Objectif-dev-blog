"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import ScrollProgressBar from '@/components/ScrollProgressBar/ScrollProgressBar';


export default function NavBar() {
  const [isConnect, setIsConnect] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const isArticlePage = pathname.startsWith('/blog/');

  const linkClasses = "relative pb-1";
  const activeLinkClasses = "font-bold after:absolute after:w-full after:h-[3px] after:bg-primary after:-bottom-1 after:left-0";
  const hoverClasses = "hover:after:absolute hover:after:w-full hover:after:h-[3px] hover:after:bg-primary hover:after:-bottom-1 hover:after:left-0";

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("jwtToken");
      setIsConnect(!!token);
    };

    checkAuth();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setIsConnect(false);
    router.push("/signin");
  };

  return (
    <nav className="fixed top-0 left-0 w-full p-4 shadow-md z-50 bg-white">
      <div className="container mx-auto flex flex-col items-center lg:flex-row lg:justify-between">
        <div className="flex justify-center w-full lg:w-auto">
          <Image 
            src="/assets/logo.png" 
            alt="Logo" 
            width={200} 
            height={150} 
          />
        </div>
        <div className="flex flex-col items-center mt-4 lg:mt-0 lg:flex-row lg:space-x-4 sm:flex-row sm:space-x-4 sm:items-center sm:justify-center w-full lg:w-auto">
          <div className="flex space-x-4">
            <Link href="/" className={`${linkClasses} ${pathname === "/" ? activeLinkClasses : ""} ${hoverClasses}`}>Accueil</Link>
            <Link href="/blog" className={`${linkClasses} ${pathname === "/blog" ? activeLinkClasses : ""} ${hoverClasses}`}>Articles</Link>
            <Link href="/about" className={`${linkClasses} ${pathname === "/about" ? activeLinkClasses : ""} ${hoverClasses}`}>En savoir plus</Link>
          </div>
          {isConnect && (
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <Link href="/admin/page-admin" className={`${linkClasses} ${pathname === "/admin/page-admin" ? activeLinkClasses : ""} ${hoverClasses}`}>Dashboard</Link>
              <button
                onClick={handleLogout}
                className="px-2 bg-primary text-white rounded-md transition duration-300 ease-in-out hover:bg-colorBg"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
      <ScrollProgressBar isVisible={isArticlePage} />
    </nav>
  );
}
