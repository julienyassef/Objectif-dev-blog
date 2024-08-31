"use client";

import React, { ReactNode, useState, useEffect, createContext, useTransition } from 'react';
import { getAllAuthors } from '@/actions/authors';
import Loader from '@/app/loader';

interface AuthorType {
  _id: string;
  name: string;
}

type AuthorsContextType = {
  setAuthors: (authors: AuthorType[]) => void;
  authors: AuthorType[] | null;
  isPending: boolean;
};

export const AuthorsContext = createContext<AuthorsContextType>({
  setAuthors: () => {
    throw new Error("setAuthors function is not initialized");
  },
  authors: null,
  isPending: true,
});

const AuthorsProvider = ({ children }: { children: ReactNode }) => {
  const [authors, setAuthors] = useState<AuthorType[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadAuthors = async () => {
    const response = await getAllAuthors();
    if (response.success && response.data) {
      setAuthors(response.data);
    } else {
      setAuthors([]);
    }
  };

  useEffect(() => {
    startTransition(async () => {
      await loadAuthors();
    });
  }, []);

  if (isPending || !authors) {
    return <Loader />;
  }

  return (
    <AuthorsContext.Provider value={{ setAuthors, authors, isPending }}>
      {children}
    </AuthorsContext.Provider>
  );
};

export default AuthorsProvider;
