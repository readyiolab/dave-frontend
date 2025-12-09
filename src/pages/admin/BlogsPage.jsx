import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../components/lib/api';
import { useToast } from '@/components/ui/use-toast';
import BlogTable from '../../components/admin/Blogs/BlogTable';
import BlogForm from '../../components/admin/Blogs/BlogForm';

export default function BlogsPage() {
  const [page, setPage] = useState(1);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const pageSize = 10;
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['blogs', page],
    queryFn: async () => {
      const response = await api.get(`/blogs?page=${page}&pageSize=${pageSize}`);
      return response.data; // data is an array
    },
    refetchOnWindowFocus: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Close form handler with refetch
  const handleFormClose = async (shouldRefetch = false) => {
    setIsFormVisible(false);
    if (shouldRefetch) {
      try {
        await refetch();
      } catch (error) {
        console.error('Error refetching blogs:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="h-10 bg-gray-300 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    toast({ 
      title: 'Error', 
      description: 'Failed to fetch blogs', 
      variant: 'destructive' 
    });
    
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load blogs</h3>
              <p className="text-gray-600 mb-4">There was an error loading your blog posts. Please try again.</p>
              <button 
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const blogs = data || [];
  const stats = {
    total: blogs.length,
    published: blogs.filter(blog => blog.status === 'published').length,
    drafts: blogs.filter(blog => blog.status === 'draft').length,
    totalLikes: blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600 mt-1">Create, edit, and manage your blog posts</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                isFormVisible 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              {isFormVisible ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Hide Form
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Blog
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Create Form */}
        {isFormVisible && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Create New Blog Post</h2>
              <p className="text-sm text-gray-600 mt-1">Fill in the details below to create a new blog post</p>
            </div>
            <div className="p-6">
              <BlogForm 
                setIsDialogOpen={handleFormClose}
                onSuccess={() => handleFormClose(true)}
              />
            </div>
          </div>
        )}

        {/* Blog Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">All Blog Posts</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, stats.total)} of {stats.total} posts
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Status</option>
                  <option>Published</option>
                  <option>Draft</option>
                  <option>Archived</option>
                </select>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {stats.total === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first blog post</p>
              <button
                onClick={() => setIsFormVisible(true)}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Post
              </button>
            </div>
          ) : (
            <BlogTable
              blogs={blogs}
              page={page}
              pageSize={pageSize}
              total={stats.total}
              setPage={setPage}
              onUpdate={() => refetch()}
            />
          )}
        </div>
      </div>
    </div>
  );
}