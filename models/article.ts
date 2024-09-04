import mongoose, { Schema, Model } from 'mongoose';

interface ContentElement {
  type: 'text' | 'vidéo' | 'photo' | 'link' | 'h2';
  value: string;
}

export interface Article {
  title: string;
  slug: string;
  content: ContentElement[];
  createdAt: Date;
  views: number;
  author: string;
  tags: string[];
  likes: number;
  likesByUserId: string[]; 
}

const ContentElementSchema = new Schema({
  type: { type: String, required: true },
  value: { type: String, required: true },
});

const ArticleSchema = new Schema<Article>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: [ContentElementSchema],
  createdAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  author: { type: String, required: true },
  tags: [{ type: String, required: true }],
  likes: { type: Number, default: 0 },
  likesByUserId: {
    type: [String],
    default: [],
  },
});

const Article: Model<Article> = mongoose.models.Article || mongoose.model<Article>('Article', ArticleSchema);

export default Article;
