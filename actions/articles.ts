"use server";
import fs from 'fs';
import path from 'path';
import dbConnect from '@/utils/dbConnect';
import ArticleModel from '@/models/article';
import { compressFile, uploadFileToStorage } from '@/utils/fileHandlers';

type ContentElement = {
  type: 'vidéo' | 'photo' | 'text' | 'link' | 'h2';
  value: string;
  order: number;
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
  await dbConnect();
  console.log('Début de la fonction createArticle'); // Vérifiez que la fonction démarre

  try {
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const author = formData.get('author') as string;
    const tags = (formData.get('tags') as string)?.split(',').map(tag => tag.trim());

    console.log('FormData reçu :', { title, slug, author, tags });

    const content: ContentElement[] = [];
    let order = 0;

    // Vérifiez les entrées de formData
    for (const [key, value] of formData.entries()) {
      console.log('Traitement du FormData - Clé:', key, 'Valeur:', value);

      if (key.startsWith('file-')) {
        const file = value as File;
        const buffer = Buffer.from(await file.arrayBuffer());

        try {
          console.log('Traitement du fichier :', file.name);
          const compressedFile = await compressFile(buffer, file.type);
          const fileUrl = await uploadFileToStorage(compressedFile, file.name, file.type);

          if (!fileUrl) {
            console.error('Erreur : file URL non défini après téléchargement');
            continue;
          }

          const fileType = file.type.startsWith('video/') ? 'vidéo' : 'photo';
          const order = content.length; // Utilisez l'ordre fourni
          content.push({ type: fileType, value: fileUrl, order });

          console.log('Fichier ajouté à content:', { fileType, fileUrl, order });
        } catch (error) {
          console.error('Erreur lors du traitement du fichier:', file.name, error);
          throw error;
        }
      } else if (key.startsWith('content-')) {
        const element = JSON.parse(value as string);
        console.log('Élément de contenu reçu:', element);

        if (['vidéo', 'photo', 'text', 'link', 'h2'].includes(element.type)) {
          content.push(element); // Utilisez l'ordre fourni
          console.log('Élément ajouté à content:', { element});
        }
      }
    }

    // Triez le contenu par l'ordre avant de le sauvegarder
    content.sort((a, b) => a.order - b.order);
    console.log('Contenu à sauvegarder dans MongoDB:', content);

    const existingArticle = await ArticleModel.findOne({ slug });
    if (existingArticle) {
      console.log('Un article avec ce slug existe déjà.');
      return { success: false, error: 'Un article avec ce slug existe déjà, changer de slug' };
    }

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

    console.log('Article en cours de sauvegarde dans MongoDB');
    const savedArticle = await newArticle.save();
    console.log('Article sauvegardé dans MongoDB:', savedArticle);

    const plainArticle = toPlainObject(savedArticle.toObject());
    console.log('Article transformé en objet brut:', plainArticle);

    return { success: true, article: plainArticle };

  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    return { success: false, error: 'Failed to create article' };
  }
};

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
      // Trie le contenu par le champ `order`
      article.content.sort((a, b) => a.order - b.order);
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
