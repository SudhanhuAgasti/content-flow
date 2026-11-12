import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { categoryService } from '../../services/categoryService.js';
import { Button } from '../../components/common/Button.jsx';
import { Input } from '../../components/common/Input.jsx';
import { Textarea } from '../../components/common/Textarea.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { ConfirmDialog } from '../../components/common/ConfirmDialog.jsx';
import { Skeleton } from '../../components/common/Skeleton.jsx';
import { EmptyState } from '../../components/common/EmptyState.jsx';
import { formatDate } from '../../utils/formatters.js';
import {
  FolderTree,
  PlusCircle,
  Edit,
  Trash2,
  Sparkles,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(60, 'Name cannot exceed 60 characters'),
  description: z
    .string()
    .max(300, 'Description cannot exceed 300 characters')
    .optional(),
});

export const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAdminCategories();
      if (res.success) {
        setCategories(res.data.categories || []);
      }
    } catch (error) {
      toast.error('Failed to load categories: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    reset({ name: '', description: '' });
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    reset({ name: cat.name, description: cat.description || '' });
    setModalOpen(true);
  };

  const onSubmit = async (values) => {
    try {
      setSubmitting(true);
      if (editingCategory) {
        const res = await categoryService.updateCategory(editingCategory._id, values);
        if (res.success) {
          toast.success('Category updated successfully');
        }
      } else {
        const res = await categoryService.createCategory(values);
        if (res.success) {
          toast.success('New category created');
        }
      }
      setModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (cat) => {
    if (cat.totalContent > 0) {
      toast.error(
        `Cannot delete "${cat.name}". It has ${cat.totalContent} associated article(s). Please reassign or delete them first.`
      );
      return;
    }
    setCategoryToDelete(cat);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      setDeleting(true);
      const res = await categoryService.deleteCategory(categoryToDelete._id);
      if (res.success) {
        toast.success('Category deleted');
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
        fetchCategories();
      }
    } catch (error) {
      toast.error(error.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-obsidian-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emperor-400 mb-1 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Taxonomy Structure</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Category Management
          </h1>
          <p className="mt-1 text-sm text-obsidian-400">
            Organize content categories, view live article distribution, and manage taxonomy.
          </p>
        </div>

        <Button variant="primary" icon={PlusCircle} onClick={openCreateModal}>
          Add New Category
        </Button>
      </div>

      {/* Category Table */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-3xl overflow-hidden shadow-surface-card">
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={FolderTree}
            title="No Categories Configured"
            description="Create categories to help public readers browse articles by subject matter."
            actionLabel="Add Category"
            onAction={openCreateModal}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-obsidian-200">
              <thead className="bg-obsidian-850/80 text-[11px] uppercase tracking-wider text-obsidian-400 font-mono border-b border-obsidian-800">
                <tr>
                  <th className="px-6 py-4">Category Name</th>
                  <th className="px-6 py-4">URL Slug</th>
                  <th className="px-6 py-4">Total Articles</th>
                  <th className="px-6 py-4">Published</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800">
                {categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-obsidian-850/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-white text-sm">
                          {cat.name}
                        </p>
                        {cat.description && (
                          <p className="text-xs text-obsidian-400 mt-0.5 line-clamp-1">
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-emperor-400">
                      /{cat.slug}
                    </td>

                    <td className="px-6 py-4 font-mono text-white text-sm">
                      {cat.totalContent}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-jade-950/60 border border-jade-600/30 text-jade-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-jade-400" />
                        {cat.publishedContent} live
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-obsidian-400 font-mono">
                      {formatDate(cat.createdAt)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          className="p-1.5 rounded-lg text-obsidian-300 hover:text-white hover:bg-obsidian-800 transition-colors"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openDeleteModal(cat)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            cat.totalContent > 0
                              ? 'text-obsidian-600 cursor-not-allowed'
                              : 'text-obsidian-400 hover:text-rose-400 hover:bg-rose-950/40'
                          }`}
                          title={
                            cat.totalContent > 0
                              ? 'Cannot delete category with associated articles'
                              : 'Delete Category'
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Category Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
        description="Categories are used to organize articles and generate reader navigation menus."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Category Name"
            placeholder="e.g. Distributed Computing"
            required
            error={errors.name?.message}
            {...register('name')}
          />

          <Textarea
            label="Description (Optional)"
            placeholder="Brief editorial scope for this category..."
            rows={3}
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-obsidian-800">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={submitting}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        loading={deleting}
        title="Delete Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"?`}
      />
    </div>
  );
};

