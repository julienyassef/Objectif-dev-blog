"use client";

import { ReactNode, useState, useEffect, createContext, useTransition } from "react";
import { getExistingTags, addTag } from '@/actions/tags';
import Loader from "@/app/loader";

type TagsContextType = {
  tags: string[] | null;
  addNewTag: (name: string) => Promise<void>;
  isPending: boolean;
};

export const TagsContext = createContext<TagsContextType>({
  tags: null,
  addNewTag: async () => {
    throw new Error("addNewTag function is not initialized");
  },
  isPending: true
});

const TagsProvider = ({ children }: { children: ReactNode }) => {
  const [tags, setTags] = useState<string[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadTags = async () => {
    try {
      const response = await getExistingTags();
      if (response.success && response.data) {
        setTags(response.data.map((tag: any) => tag.name));
      } else {
        setTags([]);
      }
    } catch (error) {
      console.error("Failed to fetch tags", error);
      setTags([]);
    }
  };

  const addNewTag = async (name: string) => {
    try {
      const response = await addTag(name);
      if (response.success) {
        setTags((prevTags) => (prevTags ? [...prevTags, name] : [name]));
      }
    } catch (error) {
      console.error("Failed to add tag", error);
    }
  };

  useEffect(() => {
    startTransition(async () => {
      await loadTags();
    });
  }, []);

  if (isPending || !tags) {
    return <Loader />;
  }

  return (
    <TagsContext.Provider value={{ tags, addNewTag, isPending }}>
      {children}
    </TagsContext.Provider>
  );
};

export default TagsProvider;
