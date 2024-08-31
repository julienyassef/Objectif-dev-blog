"use server";

import dbConnect from '@/utils/dbConnect';
import Tag from '@/models/tag';

interface TagType {
  _id: string;
  name: string;
}

export const addTag = async (name: string): Promise<{ success: boolean; data?: TagType; error?: string }> => {
  await dbConnect();

  try {
    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      return { success: true, data: { _id: existingTag._id.toString(), name: existingTag.name } };
    }

    const newTag = new Tag({ name });
    const savedTag = await newTag.save();
    return { success: true, data: { _id: savedTag._id.toString(), name: savedTag.name } };
  } catch (error) {
    console.error('Error adding tag:', error);
    return { success: false, error: 'Failed to add tag' };
  }
};

export const getExistingTags = async (): Promise<{ success: boolean; data?: TagType[]; error?: string }> => {
  await dbConnect();

  try {
    const tags = await Tag.find().lean();
    const simpleTags: TagType[] = tags.map((tag: any) => ({
      _id: tag._id.toString(),
      name: tag.name,
    }));
    return { success: true, data: simpleTags };
  } catch (error) {
    console.error('Error fetching tags:', error);
    return { success: false, error: 'Failed to fetch tags' };
  }
};
