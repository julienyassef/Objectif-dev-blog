"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Modal from '@/components/Modal/ModalAddZone';
import AuthorSelect from '@/components/AuthorSelect/AuthorSelect';
import TagInput from '@/components/TagInput/TagInput';
import useArticles from '@/hooks/useArticles';

// Importez dynamiquement des composants pour garantir qu'ils ne sont utilisés que côté client
const TextZone = dynamic(() => import('@/components/ContentZones/TextZone'), { ssr: false });
const VideoZone = dynamic(() => import('@/components/ContentZones/VideoZone'), { ssr: false });
const PhotoZone = dynamic(() => import('@/components/ContentZones/PhotoZone'), { ssr: false });
const LinkZone = dynamic(() => import('@/components/ContentZones/LinkZone'), { ssr: false });
const TitleZone = dynamic(() => import('@/components/ContentZones/TitleZone'), { ssr: false });

interface ContentElement {
  id: number;
  type: 'text' | 'vidéo' | 'photo' | 'link' | 'h2';
  value?: string | File;
}

const CreateArticle: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState<ContentElement[]>([{ type: 'photo', id: Date.now() }]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const router = useRouter();
  const { createArticle } = useArticles();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSave triggered');
  
    const hasText = content.some(element => element.type === 'text' && element.value);
    const coverPhoto = content[0]?.type === 'photo' && content[0].value;
  
    if (!title || !slug) {
      setError('Le titre et le slug sont obligatoires.');
      console.error('Le titre et le slug sont obligatoires.');
      return;
    }
  
    if (!coverPhoto) {
      setError('Une photo de couverture est requise.');
      console.error('Une photo de couverture est requise.');
      return;
    }
  
    if (!hasText) {
      setError('Une zone de texte est requise.');
      console.error('Une zone de texte est requise.');
      return;
    }
      
    if (!author) {
      setError('Un auteur est requis.');
      console.error('Un auteur est requis.');
      return;
    }
  
    if (tags.length === 0) {
      setError('Au moins un tag est requis.');
      console.error('Au moins un tag est requis.');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('author', author);
    formData.append('tags', tags.join(',')); 
    content.forEach((element, index) => {
      if (element.type === 'photo' || element.type === 'vidéo') {
        formData.append(`file-${index}`, element.value as File);
        console.log(`Appending file: ${element.value}`)
      } else {
        formData.append(`content-${index}`, JSON.stringify({ type: element.type, value: element.value }));
        console.log(`Appending content: ${element.type} - ${element.value}`);
      }
    });

    try {
      
      const response = await createArticle(formData);
      console.log('Response from createArticle:', response);

      if (response.success) {
        console.log('Article saved:', response.article);
        router.push('/admin/page-admin');
      } else {
        console.error('Failed to save article:', response.error);
        setError(response.error || 'Failed to save article');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred');
    }
  };
  

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const addElement = (type: 'text' | 'vidéo' | 'photo' | 'link' | 'h2') => {
    setContent([...content, { type, id: Date.now() }]);
    setIsModalOpen(false);
  };

  const removeElement = (id: number) => {
    setContent(content.filter(element => element.id !== id));
  };

  const handleElementChange = (id: number, value: string | File) => {
    const updatedContent = content.map(element =>
      element.id === id ? { ...element, value } : element
    );
    setContent(updatedContent);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 mb-10 bg-white rounded shadow mt-[166.88px] md:mt-[122.88px] lg:mt-[78.88px]">
      <h1 className="text-3xl font-bold mb-6 text-center">Créer un nouvel article</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSave}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Titre de l'article"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setSlug(generateSlug(e.target.value));
            }}
            className="border rounded p-2 w-full mb-4"
          />
          <input
            type="text"
            placeholder="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>

        <div className="space-y-4">
          <PhotoZone key={content[0].id} onChange={(value) => handleElementChange(content[0].id, value)} title="Photo de couverture :" onRemove={() => {}} showRemoveButton={false} />
          {content.slice(1).map((element) => {
            if (element.type === 'text') {
              return <TextZone key={element.id} onChange={(value) => handleElementChange(element.id, value)} onRemove={() => removeElement(element.id)} />;
            }
            if (element.type === 'vidéo') {
              return <VideoZone key={element.id} onChange={(value) => handleElementChange(element.id, value)} onRemove={() => removeElement(element.id)} />;
            }
            if (element.type === 'photo') {
              return <PhotoZone key={element.id} onChange={(value) => handleElementChange(element.id, value)} title="Sélectionner une photo :" onRemove={() => removeElement(element.id)} />;
            }
            if (element.type === 'link') {
              return <LinkZone key={element.id} value={element.value as string || ''} onChange={(value) => handleElementChange(element.id, value)} onRemove={() => removeElement(element.id)} />;
            }
            if (element.type === 'h2') {
              return <TitleZone key={element.id} value={element.value as string || ''} onChange={(value) => handleElementChange(element.id, value)} onRemove={() => removeElement(element.id)} />;
            }
            return null;
          })}
        </div>

        <AuthorSelect author={author} setAuthor={setAuthor} />

        <TagInput tags={tags} setTags={setTags} />

        {error && <p className="text-red-500 mb-4 ">{error}</p>}

        <div className="flex justify-between items-center mt-8">
          <button onClick={() => setIsModalOpen(true)} type="button" className="text-xl bg-primary text-white p-2 rounded hover:bg-terciaire transition duration-200">
            + 
          </button>
          <button 
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-800 transition transition duration-200"
          >
            Publier
          </button>
        </div>
      </form>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={addElement} 
      />
      
    </div>
  );
};

export default CreateArticle;
