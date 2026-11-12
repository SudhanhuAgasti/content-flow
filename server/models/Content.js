import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Content title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Short summary / description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Main article content body is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category reference is required'],
      index: true,
    },
    image: {
      url: {
        type: String,
        required: [true, 'Featured image URL is required'],
      },
      publicId: {
        type: String,
        required: [true, 'Cloudinary public ID is required'],
        default: 'contentflow/default',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: '{VALUE} is not a supported status (draft | published)',
      },
      default: 'draft',
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound indexes for optimal sorting and filtering
contentSchema.index({ status: 1, createdAt: -1 });
contentSchema.index({ category: 1, status: 1, createdAt: -1 });
contentSchema.index({ title: 'text', description: 'text' });

export const Content = mongoose.model('Content', contentSchema);

