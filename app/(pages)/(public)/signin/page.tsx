"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/actions/login"; 
import Loader  from "@/app/loader";


export default function SignIn() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [shake, setShake] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const response = await login({ email, password });

    if (response.success && response.token) {
      // Stocker le token JWT dans le local storage
      localStorage.setItem("jwtToken", response.token);

      // Rediriger vers la page d'administration
      router.push('/admin/page-admin');
      setIsSuccess(true);
    } else {
      setError('Email ou mot de passe incorrect!');
      setIsSuccess(false);
      setShake(true);

        
         setTimeout(() => {
          setShake(false);
        }, 500); 
    }

    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 mt-[166.88px] md:mt-[122.88px] lg:mt-[78.88px]" >
       {loading ? <Loader /> : null} 
      <div className={`p-12 bg-colorModal rounded shadow-md text-center ${shake ? 'shake' : ''}`}>
        <h1 className="text-3xl text-bold mb-8 text-white">Connexion administrateur</h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-primary focus:outline-none"
          />
          <input
            type="password"
            placeholder="*******"
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded-lg focus:border-primary focus:ring-primary focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-3 text-xl font-medium text-gray-800 dark:text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Me connecter
          </button>
        </form>
        {error && <p className={`mt-4 ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>{error}</p>}
      </div>
    </div>
  );
}
