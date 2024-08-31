import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 md:px-8 lg:px-16 space-y-6 md:space-y-0">
        <div className="flex flex-col items-center md:items-start">
          <Image src="/assets/logo.png" alt="Logo" width={180} height={150} />
          <p className="mt-3 text-gray-400 text-center md:text-left">
            Partagez votre passion pour le développement avec nous !
          </p>
        </div>
        <div className="flex flex-col items-center md:flex-row md:space-x-8 space-y-4 md:space-y-0">
          <Link href="/" className="hover:text-primary">
            Accueil
          </Link>
          <Link href="/blog" className="hover:text-primary">
            Blog
          </Link>
          <Link href="/about" className="hover:text-primary">
            À propos
          </Link>
          <Link href="/signin" className="hover:text-primary">
            Admin SignIn
          </Link>
        </div>
      </div>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center mt-8 border-t border-gray-400 pt-4 px-4 md:px-8 lg:px-16 space-y-6 md:space-y-0">
        <div className="flex space-x-4">
          <a href="#" className="hover:text-primary">
            <Image src="/assets/logoNav/icon_github.png" alt="GitHub" width={25} height={25} />
          </a>
          <a href="#" className="hover:text-primary">
            <Image src="/assets/logoNav/icon_linkedin.png" alt="LinkedIn" width={25} height={25} />
          </a>
        </div>
        <div className="flex items-center">
          <Image src="/assets/logoPortfolioJY.png" alt="Logo" width={30} height={30} className="mr-3" />
          <p className="hover:text-primary text-center md:text-right">
            Développé par <Link href="https://julienyassef.fr/">Julien Yassef</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
