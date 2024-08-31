import mongoose, { Schema, Document } from 'mongoose';

interface Tag extends Document {
  name: string;
}

const TagSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.models.Tag || mongoose.model<Tag>('Tag', TagSchema);
