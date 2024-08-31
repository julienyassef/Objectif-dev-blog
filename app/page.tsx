"use client";

import './globals.css';
import SortedArticlesByDate from '@/components/DisplayListArticles/SortedArticlesByDate';
import SortedArticlesByPopularity from '@/components/DisplayListArticles/SortedArticlesByPopularity';
import MenuTagSelect from '@/components/MenuTagSelect/MenuTagSelect';
import Link from 'next/link';

const Home = () => {
  return (
    <>
      <main className="p-8">
        <div className="text-center mb-6 mt-[166.88px] md:mt-[122.88px] lg:mt-[78.88px]">
          <h1 className="text-3xl font-bold text-primary mb-4">Bienvenue sur le Blog</h1>
          <p className="text-lg text-justify text-gray-700">
            Ce blog est un espace dédié à mon parcours de reconversion en développement web. J&apos;y partage mes expériences, les défis rencontrés, et les compétences acquises tout au long de ma formation. Mon objectif est d&apos;inspirer et d&apos;aider ceux qui envisagent une transition similaire. Vous trouverez ici des récits personnels, des conseils pratiques, et des ressources utiles pour réussir dans le monde du développement web. Rejoignez-moi dans cette aventure et découvrez comment j&apos;ai transformé ma passion pour la technologie en une nouvelle carrière épanouissante.
          </p>
        </div>
        <div className="mb-6">
          <MenuTagSelect />
        </div>
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl text-gray-800 font-black">Découvrir les derniers articles</h2>
            <Link href="/blog?sortOrder=dateDesc">
              <p className="text-m font-black text-gray-500 rounded-sm hover:text-primary transition-colors duration-300">Voir tous</p>
            </Link>
          </div>
          <div className="h-0.5 bg-primary w-full mb-6"></div>
          <SortedArticlesByDate limit={3} />
        </div>
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl text-gray-800 font-black">Les articles les plus populaires</h2>
            <Link href="/blog?sortOrder=popularity">
              <p className="text-m font-black text-gray-500 rounded-sm hover:text-primary transition-colors duration-300">Voir tous</p>
            </Link>
          </div>
          <div className="h-0.5 bg-primary w-full mb-6"></div>
          <SortedArticlesByPopularity limit={3} />
        </div>
        <div className="flex justify-center mb-10">
          <Link href="/blog">
            <div className="bg-primary rounded-lg shadow-md text-xl text-white font-bold py-4 px-6 cursor-pointer text-center transition-colors duration-300 hover:bg-terciaire">
              Explorer tous les articles
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}

export default Home;
