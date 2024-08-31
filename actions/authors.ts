"use server";

import dbConnect from '@/utils/dbConnect';
import Author from '@/models/author';

interface AuthorType {
  _id: string;
  name: string;
}

export const getAllAuthors = async (): Promise<{ success: boolean; data?: AuthorType[]; error?: string }> => {
  await dbConnect();

  try {
    const authors = await Author.find().lean();
    const simpleAuthors: AuthorType[] = authors.map((author: any) => ({
      _id: author._id.toString(),
      name: author.name,
    }));
    return { success: true, data: simpleAuthors };
  } catch (error) {
    console.error('Error fetching authors:', error);
    return { success: false, error: 'Failed to fetch authors' };
  }
};
