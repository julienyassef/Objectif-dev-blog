// React, Next ...
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Head from "next/head";

// CSS
import "./globals.css";

// Layout
import NavBar from "@/components/Layout/NavBar/NavBar";
import Footer from "@/components/Layout/Footer/Footer";

// Provider
import ArticlesProvider from '@/providers/ArticlesProvider';
import TagsProvider from "@/providers/TagsProvider";
import AuthorsProvider from "@/providers/AuthorsProvider";

export const metadata: Metadata = {
  title: "Objectif Dev Blog",
  description: "Découvrez des articles et conseils pratiques sur le développement web, partagés par un développeur passionné. Suivez mon parcours et mes expériences !",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const title = String(metadata.title || "Default Title");
  const description = String(metadata.description || "Default Description");

  return (
    <html lang="fr">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" /> 
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://objectifdev.fr" />
        <meta property="og:image" content="https://objectifdev.fr/assets/logo.png" />
        {/* Canonical Link */}
        <link rel="canonical" href="https://objectifdev.fr" />
      </Head>
      <body>
        <div id="__next">
          <ArticlesProvider>
            <AuthorsProvider>
              <TagsProvider>
                <NavBar />
                <main>{children}</main>
                <Footer />
              </TagsProvider>
            </AuthorsProvider>
          </ArticlesProvider>
        </div>
      </body>
    </html>
  );
}
