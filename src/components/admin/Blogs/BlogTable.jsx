import React, { useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from '../../lib/api';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { 
  Edit3, 
  Trash2, 
  Eye, 
  Heart, 
  Share, 
  MessageCircle, 
  Calendar,
  User,
  TrendingUp,
  Star
} from "lucide-react";
import BlogForm from "./BlogForm";

export default function BlogTable({ blogs, page, pageSize, total, setPage, onUpdate }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (blogId) => {
      await api.delete(`/blogs/delete/${blogId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(["blogs"]);
      if (onUpdate) onUpdate();
      toast({ 
        title: "Success", 
        description: "Blog post deleted successfully" 
      });
      if (blogs.length === 1 && page > 1) {
        setPage(page - 1);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status) => {
    const styles = {
      published: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
      draft: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200",
      archived: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200"
    };
    
    return (
      <Badge variant="outline" className={styles[status] || styles.draft}>
        <div className={`w-2 h-2 rounded-full mr-1 ${
          status === 'published' ? 'bg-green-500' : 
          status === 'draft' ? 'bg-yellow-500' : 'bg-gray-500'
        }`}></div>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = (shouldRefresh = false) => {
    setIsEditDialogOpen(false);
    setSelectedBlog(null);
    if (shouldRefresh && onUpdate) {
      onUpdate();
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{total}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published (this page)</p>
                <p className="text-2xl font-bold text-green-600">
                  {blogs.filter(blog => blog.status === 'published').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drafts (this page)</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {blogs.filter(blog => blog.status === 'draft').length}
                </p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Edit3 className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Likes (this page)</p>
                <p className="text-2xl font-bold text-pink-600">
                  {blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)}
                </p>
              </div>
              <div className="h-8 w-8 bg-pink-100 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Blog Posts</CardTitle>
          <CardDescription>
            Manage all your blog posts from this dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-semibold">Post Details</TableHead>
                  <TableHead className="font-semibold hidden md:table-cell">Category</TableHead>
                  <TableHead className="font-semibold hidden sm:table-cell">Status</TableHead>
                  <TableHead className="font-semibold hidden lg:table-cell">Engagement</TableHead>
                  <TableHead className="font-semibold hidden md:table-cell">Author</TableHead>
                  <TableHead className="font-semibold hidden sm:table-cell">Date</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3">
                        {blog.image && (
                          <img 
                            src={blog.image} 
                            alt={blog.title}
                            className="w-24 h-16 sm:w-12 sm:h-12 rounded-lg object-cover border flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900 truncate">
                              {blog.title?.length > 15 ? `${blog.title.slice(0, 15)}...` : blog.title}
                            </h3>
                            {blog.is_featured && (
                              <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          
                          {blog.read_time && (
                            <div className="flex items-center gap-1 mt-1">
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{blog.read_time} min read</span>
                            </div>
                          )}
                          
                          <div className="mt-2 space-y-1 sm:hidden">
                            <div>{getStatusBadge(blog.status)}</div>
                            {blog.category && (
                              <Badge variant="outline" className="font-normal">
                                {blog.category}
                              </Badge>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="h-3 w-3" />
                              {blog.author || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDate(blog.created_at)}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>{blog.likes || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Share className="h-3 w-3" />
                                <span>{blog.shares || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                <span>{blog.comments_count || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell">
                      {blog.category ? (
                        <Badge variant="outline" className="font-normal">
                          {blog.category}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">Uncategorized</span>
                      )}
                    </TableCell>
                    
                    <TableCell className="hidden sm:table-cell">
                      {getStatusBadge(blog.status)}
                    </TableCell>
                    
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{blog.likes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Share className="h-3 w-3" />
                          <span>{blog.shares || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{blog.comments_count || 0}</span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-900">
                          {blog.author || 'Unknown'}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-sm text-gray-600 hidden sm:table-cell">
                      {formatDate(blog.created_at)}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(blog)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deleteMutation.isPending}
                              className="hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(blog.id)}
                                className="bg-red-600 hover:bg-red-700"
                                disabled={deleteMutation.isPending}
                              >
                                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-gray-600">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} results
              </p>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(page > 1 ? page - 1 : 1)}
                      className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-100'}
                    />
                  </PaginationItem>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (page <= 3) {
                      pageNumber = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = page - 2 + i;
                    }
                    
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          onClick={() => setPage(pageNumber)}
                          isActive={page === pageNumber}
                          className="cursor-pointer"
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                      className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-100'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={handleEditClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          <div className="p-0">
            <BlogForm 
              blog={selectedBlog} 
              onClose={handleEditClose}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

BlogTable.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string,
      category: PropTypes.string,
      status: PropTypes.oneOf(["draft", "published", "archived"]).isRequired,
      likes: PropTypes.number,
      shares: PropTypes.number,
      comments_count: PropTypes.number,
      author: PropTypes.string,
      image: PropTypes.string,
      is_featured: PropTypes.bool,
      read_time: PropTypes.number,
      created_at: PropTypes.string,
    })
  ).isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
};