"use client";

import Link from 'next/link';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ArticleListArrow from '@/components/DisplayListArticles/ArticleListAdmin';

const AdminHome = () => {

  const router = useRouter();

  const handleLogout = () => {
    // Supprimer le token JWT du local storage
    localStorage.removeItem("jwtToken");

    // Rediriger vers la page de connexion
    router.push("/signin");
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      router.push("/signin");
    }
  }, [router]);
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-[166.88px] md:mt-[122.88px] lg:mt-[78.88px]">
      <div className="container mx-auto flex-col">
      <h1 className="text-4xl font-bold mb-10 text-terciaire">Admin Dashboard</h1>
        <Link href="/admin/create-article" className="inline-block px-4 py-2 mb-4 text-lg text-primary font-semibold rounded-md bg-white border border-primary transition duration-300 ease-in-out hover:bg-primary hover:text-white">
            Create New Article
        </Link>
        <div className="mt-8">
          <h2 className="text-2xl text-terciaire font-semibold mb-2">Articles Overview</h2>
          <div className="h-1 bg-secondaire w-full mb-6"></div>
          <ArticleListArrow />
        </div>
        <button 
          onClick={handleLogout} 
          className="px-4 mt-12 py-2 bg-primary text-white rounded-md transition duration-300 ease-in-out hover:bg-colorBg"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default AdminHome;
