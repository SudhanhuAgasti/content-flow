import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
import { Skeleton } from '../../components/common/Skeleton.jsx';
import {
  UploadCloud,
  X,
  ArrowLeft,
  FileCheck,
  RotateCcw,
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

export const ContentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [existingImage, setExistingImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contentSchema),
  });

  const watchTitle = watch('title');
  const slugPreview = watchTitle
    ? createSlugPreview(watchTitle)
    : 'article-slug';

  // Fetch Existing Content & Categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catsRes, contentRes] = await Promise.all([
          categoryService.getAdminCategories(),
          contentService.getContentById(id),
        ]);

        if (catsRes.success) {
          setCategories(catsRes.data.categories || []);
        }

        if (contentRes.success) {
          const item = contentRes.data.content;
          reset({
            title: item.title,
            description: item.description,
            content: item.content,
            category: item.category?._id || item.category,
            status: item.status,
          });
          setExistingImage(item.image?.url);
        }
      } catch (error) {
        toast.error('Failed to load article details: ' + error.message);
        navigate('/admin/content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, reset, navigate]);

  // Handle New Image Replacement
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

    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  const cancelImageReplacement = () => {
    setNewImageFile(null);
    if (newImagePreview) {
      URL.revokeObjectURL(newImagePreview);
      setNewImagePreview(null);
    }
  };

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('content', values.content);
      formData.append('category', values.category);
      formData.append('status', values.status);

      // Only attach image if user explicitly selected a replacement
      if (newImageFile) {
        formData.append('image', newImageFile);
      }

      const res = await contentService.updateContent(id, formData);
      if (res.success) {
        toast.success('Article updated successfully in MongoDB!');
        navigate('/admin/content');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update article');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

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
              <FileCheck className="w-3.5 h-3.5" />
              <span>Article Revision</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Edit Article
            </h1>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-3xl p-8 space-y-6 shadow-surface-card">
          {/* Title */}
          <div>
            <Input
              label="Article Title"
              required
              error={errors.title?.message}
              {...register('title')}
            />
            <div className="mt-2 flex items-center gap-2 text-xs font-mono text-obsidian-400">
              <span className="text-obsidian-500">Live URL Slug:</span>
              <span className="text-emperor-400 font-semibold">/{slugPreview}</span>
            </div>
          </div>

          {/* Description */}
          <Textarea
            label="Short Summary / Excerpt"
            rows={3}
            required
            error={errors.description?.message}
            {...register('description')}
          />

          {/* Category & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Category"
              required
              error={errors.category?.message}
              options={categories.map((c) => ({ value: c._id, label: c.name }))}
              {...register('category')}
            />

            <Select
              label="Publication Status"
              required
              options={[
                { value: 'draft', label: 'Draft (Hidden from Public)' },
                { value: 'published', label: 'Published (Live on Public Portal)' },
              ]}
              {...register('status')}
            />
          </div>

          {/* Featured Image Management */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold tracking-wide uppercase text-obsidian-300">
              Featured Image
            </label>

            {newImagePreview ? (
              <div className="space-y-2">
                <span className="text-xs text-emperor-400 font-medium">
                  New Replacement Image Selected:
                </span>
                <div className="relative rounded-2xl overflow-hidden border border-emperor-500/50 max-h-72">
                  <img
                    src={newImagePreview}
                    alt="Replacement Preview"
                    className="w-full h-72 object-cover"
                  />
                  <button
                    type="button"
                    onClick={cancelImageReplacement}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-obsidian-950/80 text-rose-400 hover:bg-rose-950 transition-colors shadow-lg"
                    title="Cancel Replacement"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : existingImage ? (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-obsidian-750 max-h-64">
                  <img
                    src={existingImage}
                    alt="Current Featured"
                    className="w-full h-64 object-cover"
                  />
                  <span className="absolute bottom-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-obsidian-950/80 border border-obsidian-750 text-obsidian-200 backdrop-blur-sm">
                    Current Image Preserved
                  </span>
                </div>

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-obsidian-750 text-xs font-semibold text-emperor-400 cursor-pointer transition-colors">
                  <UploadCloud className="w-4 h-4" />
                  <span>Choose Replacement Image</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : null}
          </div>

          {/* Main Article Content */}
          <Textarea
            label="Article Body Content"
            rows={12}
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
            Save Changes to MongoDB
          </Button>
        </div>
      </form>
    </div>
  );
};
