import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Save, FileText, User, Settings, Tags, Image, Clock, Star } from "lucide-react";
import Editor from "../../Editor/Editor";
import { Toaster } from "sonner";

export default function BlogForm({ onClose, blog }) {
  // Handle null/undefined blog prop
  const blogData = blog || {};
  
  const [formData, setFormData] = useState({
    title: blogData.title || "",
    slug: blogData.slug || "",
    excerpt: blogData.excerpt || "",
    content: blogData.content ? (typeof blogData.content === 'string' ? JSON.parse(blogData.content) : blogData.content) : { blocks: [] },
    category: blogData.category || "",
    image: blogData.image || "",
    author: blogData.author || "",
    author_bio: blogData.author_bio || "",
    status: blogData.status || "draft",
    read_time: blogData.read_time || 5,
    tags: Array.isArray(blogData.tags)
      ? blogData.tags.join(", ")
      : (typeof blogData.tags === "string" ? blogData.tags : ""),
    is_featured: blogData.is_featured || false,
    meta_description: blogData.meta_description || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Function to generate slug from title
  const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .substring(0, 100); // Limit length
};

  // Update slug when title changes
  useEffect(() => {
    if (formData.title && !blogData.id) { // Only auto-generate for new blogs
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.title),
      }));
    }
  }, [formData.title, blogData.id]);

  const handleEditorChange = (editorData) => {
    setFormData((prev) => ({ ...prev, content: editorData }));
  };

  const handleImageUpload = async (files) => {
    const file = files[0];
    if (!file) {
      toast({
        title: "Error",
        description: "No file provided",
        variant: "destructive",
      });
      throw new Error("No file provided");
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Only JPEG, PNG, and GIF files are allowed",
        variant: "destructive",
      });
      throw new Error("Invalid file type");
    }
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);
    try {
      const response = await api.post("/blogs/upload-image", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.file.url;
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to upload image",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleFeaturedImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      });
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Only JPEG, PNG, and GIF files are allowed",
        variant: "destructive",
      });
      return;
    }
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);
    try {
      const response = await api.post("/blogs/upload-image", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData({ ...formData, image: response.data.file.url });
      toast({
        title: "Success",
        description: "Featured image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to upload featured image",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      toast({
        title: "Error",
        description: "Title and slug are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        ...formData,
        content: formData.content,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag)
          : [],
      };

      let response;
      if (blogData.id) {
        response = await api.put(`/blogs/update/${blogData.id}`, data);
      } else {
        response = await api.post("/blogs/publish", data);
      }

      await queryClient.invalidateQueries(["blogs"]);
      toast({
        title: "Success",
        description: blogData.id ? "Blog updated successfully" : "Blog created successfully",
      });
      onClose(true);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to save blog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-2 sm:p-4 space-y-6">
      <Toaster />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {blogData.id ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {blogData.id ? 'Update your existing blog post' : 'Fill in the details to create a new blog post'}
          </p>
        </div>
        {blogData.id && (
          <Badge className={getStatusColor(formData.status)}>
            {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
          </Badge>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the main details about your blog post
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter blog post title"
                  className="mt-1"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="slug" className="text-sm font-medium">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="blog-post-slug"
                  className="mt-1"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {blogData.id ? 'Edit the slug if needed' : 'Automatically generated from title, but you can edit it'}
                </p>
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Technology, Tutorial"
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
                <div className="flex-1">
                  <Label htmlFor="read_time" className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Read Time (min)
                  </Label>
                  <Input
                    id="read_time"
                    type="number"
                    value={formData.read_time}
                    onChange={(e) =>
                      setFormData({ ...formData, read_time: parseInt(e.target.value) || 5 })
                    }
                    min="1"
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center space-x-2 sm:pt-0 pt-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <Label htmlFor="featured" className="text-sm font-medium">Featured</Label>
                  <Switch
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt" className="text-sm font-medium">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Write a brief summary of your blog post..."
                className="mt-1 resize-y min-h-[80px]"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="meta_description" className="text-sm font-medium">Meta Description (for SEO)</Label>
              <Textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="Write a meta description for search engines..."
                className="mt-1 resize-y min-h-[80px]"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="featuredImage" className="text-sm font-medium flex items-center gap-1">
                <Image className="h-4 w-4" />
                Featured Image
              </Label>
              <Input
                id="featuredImage"
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleFeaturedImageUpload}
                className="mt-1"
              />
              {formData.image && (
                <div className="mt-2">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full max-w-md h-auto object-cover rounded-md border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="tags" className="text-sm font-medium flex items-center gap-1">
                <Tags className="h-4 w-4" />
                Tags
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="technology, programming, tutorial"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <CardDescription>
              Write your blog post content using the rich text editor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-2 min-h-[300px]">
              <Editor
                key={blogData.id || 'new-blog'}
                data={formData.content}
                onChange={handleEditorChange}
                onImageUpload={handleImageUpload}
                holder={`blog-editor-${blogData.id || 'new'}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Author Information
            </CardTitle>
            <CardDescription>
              Details about the blog post author
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="author" className="text-sm font-medium">Author Name</Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="John Doe"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="author_bio" className="text-sm font-medium">Author Bio</Label>
              <Textarea
                id="author_bio"
                value={formData.author_bio}
                onChange={(e) => setFormData({ ...formData, author_bio: e.target.value })}
                placeholder="Brief bio about the author..."
                className="mt-1 resize-y min-h-[60px]"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Publishing Settings
            </CardTitle>
            <CardDescription>
              Control the publication status of your blog post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Label className="text-sm font-medium">Publication Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Draft
                    </div>
                  </SelectItem>
                  <SelectItem value="published">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Published
                    </div>
                  </SelectItem>
                  <SelectItem value="archived">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      Archived
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Draft posts are not visible to the public
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onClose(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <div className="flex flex-col sm:flex-row gap-2">
            {blogData.id && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormData({ ...formData, status: 'draft' })}
                disabled={isSubmitting}
              >
                Save as Draft
              </Button>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting
                ? 'Saving...'
                : blogData.id
                  ? 'Update Blog'
                  : 'Create Blog'
              }
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

BlogForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  blog: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    slug: PropTypes.string,
    excerpt: PropTypes.string,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    category: PropTypes.string,
    image: PropTypes.string,
    author: PropTypes.string,
    author_bio: PropTypes.string,
    status: PropTypes.oneOf(["draft", "published", "archived"]),
    read_time: PropTypes.number,
    tags: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    is_featured: PropTypes.bool,
    meta_description: PropTypes.string,
  }),
};