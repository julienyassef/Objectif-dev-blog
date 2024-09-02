"use client";

import React, { useEffect, useState } from 'react';
import NotFound from "@/components/NotFound/NotFound";
import ArticlePageComponent from '@/components/ArticlePage/ArticlePage';
import Loader from '@/app/loader';
import Image from 'next/image';
import useArticles from '@/hooks/useArticles';
import RelatedArticleCard from '@/components/Cards/RelatedArticleCard/RelatedArticleCard';
import ShareButton from '@/components/Buttons/ShareButton/ShareButton';
import LikeButton from '@/components/Buttons/LikeButton/LikeButton';
import Head from 'next/head';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

const ArticlePage = ({ params }: ArticlePageProps) => {
  const { articles, isPending, incrementViews } = useArticles();
  const [hasIncremented, setHasIncremented] = useState(false);

  const article = articles?.find(article => article.slug === params.slug);

  useEffect(() => {
    if (article && !hasIncremented) {
      incrementViews(params.slug).then(() => setHasIncremented(true));
    }
  }, [params.slug, article, hasIncremented, incrementViews]);

  if (isPending || !articles) {
    return <Loader />;
  }

  if (!article) {
    return (
      <NotFound 
        title="Article non trouvé"
        description="Désolé, nous n'avons pas pu trouver l'article que vous recherchez. Il se peut qu'il ait été supprimé ou que le lien soit incorrect."
        linkText="Retour au blog"
        linkHref="/blog"
      />
    );
  } else {
    // Extraire les tags de l'article actuel
    const articleTags = new Set(article.tags || []);

    // Trier les autres articles en fonction du nombre de tags partagés
    const sortedArticles = articles
      .filter(a => a.slug !== params.slug)
      .map(a => ({
        ...a,
        sharedTagsCount: (a.tags || []).filter(tag => articleTags.has(tag)).length,
      }))
      .sort((a, b) => b.sharedTagsCount - a.sharedTagsCount);

    // Prendre les articles les plus similaires
    let relatedArticles = sortedArticles.filter(a => a.sharedTagsCount > 0);

    // Si pas assez d'articles similaires, ajouter les articles les plus récents
    if (relatedArticles.length < 9) {
      const additionalArticles = sortedArticles
        .filter(a => a.sharedTagsCount === 0)
        .slice(0, 9 - relatedArticles.length);
      relatedArticles = [...relatedArticles, ...additionalArticles];
    }

    // Séparez les éléments de contenu pour garantir que la photo soit en premier
    const photoElement = article.content.find((element) => element.type === 'photo');

    return (
      <>
        <Head>
          <title>{article.title} - Objectif Dev Blog</title>
          <meta name="description" content={article.title || "Découvrez cet article passionnant sur Objectif Dev Blog"} />
          <meta property="og:title" content={article.title} />
          <meta property="og:description" content={article.title|| "Découvrez cet article passionnant sur Objectif Dev Blog"} />
          <meta property="og:image" content={photoElement ? photoElement.value : "https://objectifdev.fr/assets/default-image.png"} />
          <meta property="og:url" content={`https://objectifdev.fr/blog/${article.slug}`} />
          <link rel="canonical" href={`https://objectifdev.fr/blog/${article.slug}`} />
        </Head>
        <div className="container mx-auto mt-[166.88px] md:mt-[122.88px] lg:mt-[78.88px]">
          <div className="flex flex-col">
            <div className="w-full">
              {photoElement && (
                <div className="relative w-full h-auto">
                  <div className="relative w-full h-0" style={{ paddingBottom: '50%' }}> 
                    <Image 
                      src={photoElement.value} 
                      alt={article.title} 
                      layout="fill" 
                      objectFit="cover" 
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white bg-opacity-75 p-4 w-3/4 max-w-md text-center">
                      <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-relaxed md:leading-relaxed">
                        {article.title}
                      </h1>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between text-secondaire font-bold text-sm pl-6 pr-6 pt-4 pb-4">
                <p>Par {article.author} | Publié le {new Date(article.createdAt).toLocaleDateString()}</p>
                <div className="flex items-center space-x-4">
                  <LikeButton slug={article.slug} />
                  <ShareButton slug={article.slug} title={article.title} />
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row">
              <article className="lg:w-2/3 w-full">
                <ArticlePageComponent article={article} />
                <div className="flex items-center justify-between text-secondaire font-bold text-sm pl-6 pr-6 pt-4 pb-4 mb-4">
                  <p>Par {article.author} | Publié le {new Date(article.createdAt).toLocaleDateString()}</p>
                  <div className="flex items-center space-x-4">
                    <LikeButton slug={article.slug} />
                    <ShareButton slug={article.slug} title={article.title} />
                  </div>
                </div>
              </article>
              <aside className="lg:w-1/3 w-full pr-6 mt-8 lg:mt-0 lg:ml-8">
                <h3 className="text-2xl text-center font-semibold mt-4 mb-4">Parcourez d&apos;autres articles</h3>
                {relatedArticles.map((relatedArticle) => (
                  <RelatedArticleCard key={relatedArticle.slug} article={relatedArticle} />
                ))}
              </aside>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default ArticlePage;
