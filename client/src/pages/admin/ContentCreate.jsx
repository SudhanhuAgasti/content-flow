import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createSlugPreview } from '../../utils/formatters.js';
import { contentService } from '../../services/contentService.js';
import { categoryService } from '../../services/categoryService.js';
import { Input } from '../../components/common/Input.jsx';
import { Textarea } from '../../components/common/Textarea.jsx';
import { Select } from '../../components/common/Select.jsx';
import { Button } from '../../components/common/Button.jsx';
import {
  UploadCloud,
  X,
  ArrowLeft,
  PlusCircle,
  FileCheck,
  Image as ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';

const contentSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(200, 'Title cannot exceed 200 characters'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long')
    .max(500, 'Description cannot exceed 500 characters'),
  content: z
    .string()
    .min(10, 'Article body content must be at least 10 characters long'),
  category: z.string().min(1, 'Please select a category'),
  status: z.enum(['draft', 'published']),
});

export const ContentCreate = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: '',
      description: '',
      content: '',
      category: '',
      status: 'draft',
    },
  });

  const watchTitle = watch('title');
  const slugPreview = watchTitle
    ? createSlugPreview(watchTitle)
    : 'article-slug';

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getAdminCategories();
        if (res.success) {
          setCategories(res.data.categories || []);
        }
      } catch (err) {
        toast.error('Failed to load categories: ' + err.message);
      }
    };
    fetchCats();
  }, []);

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Selected file is not an image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image exceeds 5MB maximum allowed limit');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  const onSubmit = async (values) => {
    if (!imageFile) {
      toast.error('Please upload a featured image for this article');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('content', values.content);
      formData.append('category', values.category);
      formData.append('status', values.status);
      formData.append('image', imageFile);

      const res = await contentService.createContent(formData);
      if (res.success) {
        toast.success('Article created and persisted in MongoDB!');
        navigate('/admin/content');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create article');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-obsidian-800">
        <div className="flex items-center gap-4">
          <Link to="/admin/content">
            <button
              type="button"
              className="p-2 rounded-xl bg-obsidian-900 border border-obsidian-800 text-obsidian-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emperor-400 mb-0.5 font-mono">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Editorial Publishing</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Create New Article
            </h1>
          </div>
        </div>
      </div>

      {/* Content Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-3xl p-8 space-y-6 shadow-surface-card">
          {/* Title */}
          <div>
            <Input
              label="Article Title"
              placeholder="e.g. Architecting Distributed Systems with Node.js and MongoDB"
              required
              error={errors.title?.message}
              {...register('title')}
            />
            {/* Live Slug Preview */}
            <div className="mt-2 flex items-center gap-2 text-xs font-mono text-obsidian-400">
              <span className="text-obsidian-500">Auto-Generated Slug:</span>
              <span className="text-emperor-400 font-semibold">/{slugPreview}</span>
            </div>
          </div>

          {/* Description */}
          <Textarea
            label="Short Summary / Excerpt"
            rows={3}
            placeholder="A compelling, SEO-friendly summary displayed on article cards and search results..."
            required
            error={errors.description?.message}
            {...register('description')}
          />

          {/* Category & Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Category"
              required
              error={errors.category?.message}
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
              placeholder="Select category..."
              {...register('category')}
            />

            <Select
              label="Publication Status"
              required
              options={[
                { value: 'draft', label: 'Draft (Editorial Revision)' },
                { value: 'published', label: 'Published (Live on Public Portal)' },
              ]}
              {...register('status')}
            />
          </div>

          {/* Featured Image Dropzone */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold tracking-wide uppercase text-obsidian-300">
              Featured Image <span className="text-emperor-500">*</span>
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-obsidian-750 max-h-72 group">
                <img
                  src={imagePreview}
                  alt="Featured Preview"
                  className="w-full h-72 object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-obsidian-950/80 text-rose-400 hover:bg-rose-950 transition-colors shadow-lg"
                  title="Remove Image"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-obsidian-750 hover:border-emperor-500/60 rounded-2xl cursor-pointer bg-obsidian-950/40 hover:bg-obsidian-850/30 transition-all duration-200 group">
                <div className="w-12 h-12 rounded-xl bg-obsidian-850 border border-obsidian-750 flex items-center justify-center text-emperor-400 mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-white">
                  Click to upload or drag & drop image
                </p>
                <p className="text-xs text-obsidian-400 mt-1">
                  PNG, JPG, WEBP or GIF up to 5MB
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Main Article Content */}
          <Textarea
            label="Article Body Content"
            rows={12}
            placeholder="Write complete article content here (supports markdown or standard HTML formatting)..."
            required
            error={errors.content?.message}
            {...register('content')}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Link to="/admin/content">
            <Button variant="secondary" disabled={submitting}>
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={submitting}
            icon={FileCheck}
          >
            Create & Save Article
          </Button>
        </div>
      </form>
    </div>
  );
};
