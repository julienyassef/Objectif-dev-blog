"use server";

import fs from 'fs';
import path from 'path';
import dbConnect from '@/utils/dbConnect';
import ArticleModel from '@/models/article';
import { compressFile, uploadFileToStorage } from '@/utils/fileHandlers';

type ContentElement = {
  type: 'vidéo' | 'photo' | 'text' | 'link' | 'h2';
  value: string;
};

const toPlainObject = (doc: any) => {
  const plainObj = { ...doc, _id: doc._id.toString() };
  if (plainObj.content) {
    plainObj.content = plainObj.content.map((element: any) => ({
      ...element,
      _id: element._id.toString(),
    }));
  }
  return plainObj;
};

export const createArticle = async (formData: FormData) => {
  // console.log("Connecting to database...");
  await dbConnect();
  try {
    // Extraction des données du formulaire
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const author = formData.get('author') as string;
    const tags = (formData.get('tags') as string)?.split(',').map(tag => tag.trim());

    // console.log("Title:", title);
    // console.log("Slug:", slug);
    // console.log("Author:", author);
    // console.log("Tags:", tags);

    // Initialisation du tableau de contenu
    const content: ContentElement[] = [];

    // console.log("Processing form data...");
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file-')) {  // Si le champ du formulaire est un fichier
        const file = value as File;
        const buffer = Buffer.from(await file.arrayBuffer());
        try {
          // console.log("Processing file:", file.name, "of type:", file.type);
          const compressedFile = await compressFile(buffer, file.type);
          const fileUrl = await uploadFileToStorage(compressedFile, file.name, file.type);

          // Vérifiez si le fichier a été correctement téléchargé
          if (!fileUrl) {
            console.error('Error: file URL is undefined after upload');
            continue;
          }

          // Ajout du fichier compressé et téléchargé au contenu
          const fileType = file.type.startsWith('video/') ? 'vidéo' : 'photo';
          content.push({ type: fileType, value: fileUrl });
          // console.log("File processed and uploaded:", fileUrl);
        } catch (error) {
          // console.error('Error processing file:', file.name, error);
          throw error;
        }
      } else if (key.startsWith('content-')) {  // Si le champ du formulaire est un contenu texte
        const element = JSON.parse(value as string);
        // Vérification que le type de l'élément est valide
        if (['vidéo', 'photo', 'text', 'link', 'h2'].includes(element.type)) {
          content.push(element as ContentElement);
        }
      }
    }

    // console.log("Final content array:", content);

    // Vérification de l'existence d'un article avec le même slug
    const existingArticle = await ArticleModel.findOne({ slug });
    if (existingArticle) {
      console.log("Article with slug already exists");
      return { success: false, error: 'Un article avec ce slug existe déjà, changer de slug' };
    }

    // Création du nouvel article
    const newArticle = new ArticleModel({
      title,
      slug,
      author,
      tags,
      content,
      views: 0,
      likes: 0,
      likesByIp: [],
    });

    // Sauvegarde du nouvel article dans la base de données
    const savedArticle = await newArticle.save();
    const plainArticle = toPlainObject(savedArticle.toObject());

    // console.log('Article successfully created:', plainArticle);

    return { success: true, article: plainArticle };

  } catch (error) {
    console.error('Error creating article:', error);
    return { success: false, error: 'Failed to create article' };
  }
};

// Les autres fonctions restent inchangées
export const getAllArticles = async () => {
  await dbConnect();
  try {
    const articles = await ArticleModel.find().lean();
    return articles.map(toPlainObject);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getArticle = async (slug: string) => {
  await dbConnect();
  try {
    const article = await ArticleModel.findOne({ slug }).lean();
    if (article) {
      return { success: true, article: toPlainObject(article) };
    } else {
      return { success: false, error: 'Article not found' };
    }
  } catch (error) {
    console.error('Error getting article:', error);
    return { success: false, error: 'Failed to get article' };
  }
};

export const toggleLike = async (slug: string, userId: string, like: boolean) => {
  await dbConnect();

  try {
    const article = await ArticleModel.findOne({ slug });
    if (article) {
      const alreadyLiked = article.likesByUserId.includes(userId);

      if (like && !alreadyLiked) {
        article.likes = (article.likes || 0) + 1;
        article.likesByUserId.push(userId);
      } else if (!like && alreadyLiked) {
        article.likes = Math.max(0, (article.likes || 0) - 1);
        article.likesByUserId = article.likesByUserId.filter(id => id !== userId);
      }

      await article.save();
      return { success: true, likes: article.likes };
    } else {
      return { success: false, error: 'Article not found' };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: 'Failed to toggle like' };
  }
};


export const incrementViews = async (slug: string) => {
  await dbConnect();
  try {
    const article = await ArticleModel.findOne({ slug });
    if (article) {
      article.views = (article.views || 0) + 1;
      await article.save();
      return { success: true, views: article.views };
    } else {
      return { error: 'Article not found' };
    }
  } catch (error) {
    console.error('Error incrementing article views:', error);
    return { error: 'Failed to increment views' };
  }
};

export const deleteArticle = async (slug: string) => {
  await dbConnect();
  try {
    // Récupérer l'article avant de le supprimer
    const article = await ArticleModel.findOne({ slug });

    if (!article) {
      return { success: false, error: 'Article not found' };
    }

    // Récupérer les chemins des fichiers vidéo et photo
    const filesToDelete = article.content
      .filter(element => element.type === 'photo' || element.type === 'vidéo')
      .map(element => path.join(process.cwd(), 'public', element.value));

    // Supprimer les fichiers associés
    filesToDelete.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      } else {
        console.log(`File not found: ${filePath}`);
      }
    });

    // Supprimer l'article de la base de données
    const result = await ArticleModel.deleteOne({ slug });

    if (result.deletedCount > 0) {
      return { success: true, message: 'Article deleted successfully' };
    } else {
      return { success: false, error: 'Failed to delete article' };
    }
  } catch (error) {
    console.error('Error deleting article:', error);
    return { success: false, error: 'Failed to delete article' };
  }
};
