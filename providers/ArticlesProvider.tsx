"use client";

import { ReactNode, useState, useEffect, createContext, useTransition } from "react";
import { Article } from "@/models/article";
import { getAllArticles, toggleLike, incrementViews, createArticle, getArticle as getArticleAPI, deleteArticle } from '@/actions/articles';
import Loader from "@/app/loader";

type ArticlesContextType = {
  setArticles: (articles: Article[]) => void;
  articles: Article[] | null;
  isPending: boolean;
  toggleLike: (slug: string, like: boolean, req: Request) => Promise<void>;
  incrementViews: (slug: string) => Promise<void>;
  createArticle: (formData: FormData) => Promise<{ success: boolean; article?: Article; error?: string }>;
  getArticle: (slug: string) => Promise<{ success: boolean; article?: Article; error?: string }>;
  deleteArticle: (slug: string) => Promise<{ success: boolean; error?: string }>;
};


export const ArticlesContext = createContext<ArticlesContextType>({
  setArticles: () => {
    throw new Error("setArticles function is not initialized");
  },
  articles: null,
  isPending: true,
  toggleLike: async () => {
    throw new Error("toggleLike function is not initialized");
  },
  incrementViews: async () => {
    throw new Error("incrementViews function is not initialized");
  },
  createArticle: async () => {
    throw new Error("createArticle function is not initialized");
  },
  getArticle: async () => {
    throw new Error("getArticle function is not initialized");
  },
  deleteArticle: async () => {
    throw new Error("deleteArticle function is not initialized");
  },
});

const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadArticles = async () => {
    const fetchedArticles = await getAllArticles();
    setArticles(fetchedArticles);
  };

  // /providers/ArticlesProvider.tsx

const handleToggleLike = async (slug: string, like: boolean, req: Request) => {
  const response = await toggleLike(slug, like, req); 
  if (response.success) {
    setArticles((prevArticles) =>
      prevArticles?.map((article) =>
        article.slug === slug ? { ...article, likes: response.likes ?? 0 } : article
      ) || null
    );
  }
};

  
  

  const handleIncrementViews = async (slug: string) => {
    const response = await incrementViews(slug);
    if (response.success) {
      setArticles((prevArticles) =>
        prevArticles?.map((article) =>
          article.slug === slug ? { ...article, views: response.views ?? 0 } : article
        ) || null
      );
    }
  };

  const handleCreateArticle = async (formData: FormData) => {
    return await createArticle(formData);
  };

  const handleGetArticle = async (slug: string) => {
    return await getArticleAPI(slug);
  };

  const handleDeleteArticle = async (slug: string) => {
    return await deleteArticle(slug);
  };

  useEffect(() => {
    startTransition(async () => {
      await loadArticles();
    });
  }, []);

  if (isPending || !articles) {
    return <Loader />;
  }

  return (
    <ArticlesContext.Provider value={{ setArticles, articles, isPending, toggleLike: handleToggleLike, incrementViews: handleIncrementViews, createArticle: handleCreateArticle, getArticle: handleGetArticle, deleteArticle: handleDeleteArticle }}>
      {children}
    </ArticlesContext.Provider>
  );
};

export default ArticlesProvider;
