import mongoose, { Schema, Document } from 'mongoose';

export interface Author extends Document {
  name: string;
}

const AuthorSchema = new Schema({
  name: { type: String, required: true },
});

export default mongoose.models.Author || mongoose.model<Author>('Author', AuthorSchema);