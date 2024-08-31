import fs from 'fs'; // Un module Node.js utilisé pour interagir avec le système de fichiers
import path from 'path'; // Un module Node.js pour travailler avec les chemins de fichiers et de répertoires.
import { v4 as uuidv4 } from 'uuid'; // Une fonction pour générer des identifiants uniques universels (UUID)
import sharp from 'sharp'; // Une bibliothèque de traitement d'images pour Node.js.

export const compressFile = async (buffer: Buffer, mimeType: string): Promise<Buffer> => {
  const supportedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

  console.log('compressFile: received file of type:', mimeType);

  // Vérifie si le type de fichier est une image
  if (supportedImageTypes.includes(mimeType)) {
    console.log('compressFile: compressing image...');
    // Utilise sharp pour redimensionner et compresser l'image
    return await sharp(buffer)
      .resize({ width: 800 }) // Redimensionne l'image à une largeur maximale de 800 pixels
      .jpeg({ quality: 75 }) // Compresse l'image en JPEG avec une qualité de 75%
      .toBuffer(); // Convertit le résultat en buffer
  } else if (mimeType.startsWith('video/')) {
    console.log('compressFile: received video, no compression applied');
    // Pour les vidéos, nous ne faisons aucune compression pour le moment, nous les retournons simplement
    return buffer;
  } else {
    throw new Error('Unsupported file format');
  }
};

export const uploadFileToStorage = async (fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> => {
  // Définit le répertoire de téléchargement des fichiers en fonction du type de fichier
  let uploadsDir;
  if (mimeType.startsWith('image/')) {
    uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'pictures');
  } else if (mimeType.startsWith('video/')) {
    uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
  } else {
    throw new Error('Unsupported file format');
  }

  // Vérifie si le répertoire existe, sinon le crée
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Génère un chemin de fichier unique en utilisant uuidv4 pour éviter les collisions de noms
  const filePath = path.join(uploadsDir, `${uuidv4()}-${fileName}`);
  // Écrit le buffer du fichier compressé dans le système de fichiers
  fs.writeFileSync(filePath, fileBuffer);

  console.log('uploadFileToStorage: file uploaded to:', filePath);

  // Retourne le chemin relatif du fichier pour un usage ultérieur dans les composants
  return `/uploads/${mimeType.startsWith('image/') ? 'pictures' : 'videos'}/${path.basename(filePath)}`;
};
