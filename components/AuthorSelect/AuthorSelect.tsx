"use client";

import React from 'react';
import useAuthors from '@/hooks/useAuthors';
import Loader from '@/app/loader';

interface AuthorSelectProps {
  author: string;
  setAuthor: React.Dispatch<React.SetStateAction<string>>;
}

const AuthorSelect: React.FC<AuthorSelectProps> = ({ author, setAuthor }) => {
  const { authors, isPending } = useAuthors();

  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAuthor(e.target.value);
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="border rounded mt-4 p-2 w-full mb-4">
      <label className="block text-lg text-colorInput font-medium">Auteur</label>
      <select
        value={author}
        onChange={handleAuthorChange}
        className="mt-1 block w-full text-colorInput border rounded p-2 shadow-sm"
      >
        <option value="">Sélectionnez un auteur</option>
        {authors?.map((authorObj, index) => (
          <option key={index} value={authorObj.name}>{authorObj.name}</option>
        ))}
      </select>
    </div>
  );
};

export default AuthorSelect;
