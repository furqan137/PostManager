import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this post'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content for this post'],
    },
    author: {
      type: String,
      required: [true, 'Please provide an author name'],
      maxlength: [50, 'Author name cannot be more than 50 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Use mongoose.models to check if the model already exists to prevent overwriting
export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);