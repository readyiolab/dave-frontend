import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Send, Share2, Heart, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { getBlogById, getCommentsByBlogId, createComment, getAllBlogs } from '../lib/api';
import SEO from "../common/SEO";

interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  meta_description: string;
  content: any; // content can be string or object from editorjs
  image: string;
  author: string;
  author_bio: string;
  read_time: number | string;
  category: string;
  tags: string[];
  is_featured: number;
  comments_count: number;
  likes: number;
  shares: number;
  created_at: string;
}

interface Comment {
  id: string | number;
  user_name: string;
  content: string;
  created_at: string;
}

// Helper to safely extract text from potential objects/arrays
// Helper to safely extract text from potential objects/arrays
const safeText = (text: any): string => {
  if (typeof text === 'string') return text;
  if (typeof text === 'number') return String(text);
  if (!text) return '';
  if (typeof text === 'object') {
    // Check for common EditorJS item properties
    if (text.content) return safeText(text.content);
    if (text.text) return safeText(text.text);

    // Fallback: mostly it's better to return empty string than JSON for display
    // console.warn('Received object for text rendering:', text);
    return '';
  }
  return '';
};

const editorJSToHtml = (content: any): string => {
  if (typeof content === "string") {
    try {
      content = JSON.parse(content);
    } catch (e) {
      console.error("Error parsing content:", e);
      return content;
    }
  }

  if (!content || !content.blocks || !Array.isArray(content.blocks)) {
    return "<p>No content available</p>";
  }

  return content.blocks
    .map((block: any) => {
      switch (block.type) {
        case "paragraph":
          return `<p class="text-gray-700 leading-relaxed mb-4">${safeText(block.data.text)}</p>`;

        case "header":
          const level = block.data.level || 2;
          return `<h${level} class="text-gray-800 font-bold mt-6 mb-3 ${level === 1 ? "text-3xl" : level === 2 ? "text-2xl" : "text-xl"
            }">${safeText(block.data.text)}</h${level}>`;

        case "list":
          const tag = block.data.style === "ordered" ? "ol" : "ul";
          const items = (block.data.items || [])
            .map((item: string) => `<li class="text-gray-700 mb-1">${safeText(item)}</li>`)
            .join("");
          return items
            ? `<${tag} class="list-${block.data.style === "ordered" ? "decimal" : "disc"
            } pl-6 my-4">${items}</${tag}>`
            : "";

        case "checklist":
          return (
            `<ul class="my-4">` +
            block.data.items
              .map(
                (item: any) =>
                  `<li class="flex items-center mb-2">
                      <input type="checkbox" disabled ${item.checked ? "checked" : ""
                  } class="mr-2"/>
                      <span>${safeText(item.text)}</span>
                  </li>`
              )
              .join("") +
            `</ul>`
          );

        case "quote":
          return `<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
                    ${safeText(block.data.text)}
                    <footer class="mt-2 text-sm text-gray-500">— ${safeText(block.data.caption)}</footer>
                  </blockquote>`;

        case "code":
          return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>${safeText(block.data.code)}</code></pre>`;

        case "embed":
          return `<div class="my-6">
                    <iframe class="w-full h-64 rounded-lg shadow-md"
                      src="${block.data.embed}"
                      frameborder="0"
                      allowfullscreen></iframe>
                    <p class="text-center text-sm text-gray-500 mt-2">${safeText(block.data.caption)}</p>
                  </div>`;

        case "table":
          const rows = block.data.content
            .map(
              (row: any[]) =>
                `<tr>${row
                  .map(
                    (cell: any) =>
                      `<td class="border px-3 py-2 text-gray-700">${safeText(cell)}</td>`
                  )
                  .join("")}</tr>`
            )
            .join("");
          return `<table class="table-auto border-collapse border my-4 w-full">${rows}</table>`;

        case "link":
          return `<a href="${block.data.link}" target="_blank" class="text-blue-600 underline">${block.data.meta?.title ||
            block.data.link}</a>`;

        case "image":
          return `<figure class="my-6">
                    <img src="${block.data.file?.url || ""}" 
                         alt="${safeText(block.data.caption) || "Image"}" 
                         class="w-full max-w-xl h-auto rounded-xl shadow-md mx-auto object-cover" />
                    <figcaption class="text-center text-sm text-gray-600 mt-2">${safeText(block.data.caption)}</figcaption>
                  </figure>`;

        case "raw":
          return block.data.html || "";

        case "marker":
          return `<mark>${safeText(block.data.text)}</mark>`;

        case "underline":
          return `<u>${safeText(block.data.text)}</u>`;

        default:
          return "";
      }
    })
    .join("");
};


const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.2 } },
};



const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    content: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const mainContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch blog by slug
        const { data: postData } = await getBlogById(slug!);
        setPost({
          id: postData.id,
          title: postData.title,
          slug: postData.slug || slug,
          excerpt: postData.excerpt || '',
          meta_description: postData.meta_description || postData.excerpt || '',
          content: postData.content,
          image: postData.image || 'https://via.placeholder.com/800',
          author: postData.author || 'Unknown',
          author_bio: postData.author_bio || '',
          created_at: postData.created_at || postData.published_at,
          read_time: postData.read_time || 5,
          category: typeof postData.category === 'string'
            ? postData.category.split(',')[0] || 'Uncategorized'
            : Array.isArray(postData.category)
              ? postData.category[0] || 'Uncategorized'
              : 'Uncategorized',
          tags: typeof postData.tags === 'string'
            ? JSON.parse(postData.tags || '[]')
            : Array.isArray(postData.tags)
              ? postData.tags
              : [],
          is_featured: postData.is_featured || 0,
          comments_count: postData.comments_count || 0,
          likes: postData.likes || 0,
          shares: postData.shares || 0,
        });
        setLikes(postData.likes || 0);
        setShares(postData.shares || 0);

        // Fetch comments
        const { data: commentsData } = await getCommentsByBlogId(postData.id);
        setComments(Array.isArray(commentsData) ? commentsData : []);

        // Fetch related posts
        const { data: allBlogs } = await getAllBlogs();
        const related = allBlogs
          .filter(
            (p: any) =>
              p.id !== postData.id &&
              (typeof p.category === 'string'
                ? p.category.split(',').some((cat: string) => postData.category.includes(cat))
                : Array.isArray(p.category)
                  ? p.category.some((cat: string) => postData.category.includes(cat))
                  : false)
          )
          .slice(0, 3)
          .map((p: any) => ({
            ...p,
            category: typeof p.category === 'string'
              ? p.category.split(',')[0] || 'Uncategorized'
              : Array.isArray(p.category)
                ? p.category[0] || 'Uncategorized'
                : 'Uncategorized',
            tags: typeof p.tags === 'string'
              ? JSON.parse(p.tags || '[]')
              : Array.isArray(p.tags)
                ? p.tags
                : [],
            slug: p.slug || '',
          }));
        setRelatedPosts(related);

        setLoading(false);
      } catch (err: any) {
        console.error('Fetch error:', err.message);
        setError(err.message || 'Failed to load blog post');
        setLoading(false);
      }
    };
    if (slug) {
      fetchData();
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      if (!mainContentRef.current) return;
      const el = mainContentRef.current;
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = el.scrollHeight - windowHeight;
      const scrolled = window.scrollY - rect.top + windowHeight;
      const percent = Math.min(Math.max((scrolled / totalHeight) * 100, 0), 100);
      setScrollProgress(percent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!commentForm.content) {
      setFormError('Comment content is required');
      return;
    }

    if (commentForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(commentForm.email)) {
      setFormError('Invalid email format');
      return;
    }

    try {
      const { data } = await createComment(post!.id, {
        userName: commentForm.name || 'Anonymous',
        userEmail: commentForm.email,
        comment: commentForm.content,
      });
      setComments([...comments, data]);
      setCommentForm({ name: '', email: '', content: '' });
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit comment. Please try again.');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCommentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLike = () => {
    setLikes(likes + 1);
    // TODO: Call API to update likes
  };

  const handleShare = async () => {
    setShares(shares + 1);
    try {
      await navigator.share({
        title: post!.title,
        text: post!.excerpt,
        url: window.location.href,
      });
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
            <div className="h-80 w-full bg-gray-200 rounded-xl mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-5/6"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded-xl"></div>
                <div className="h-64 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <motion.section
        className="py-24 bg-white text-center min-h-[60vh] flex flex-col items-center justify-center"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="bg-red-50 p-6 rounded-full mb-6">
          <MessageSquare className="h-12 w-12 text-red-500 opacity-50" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Blog Post Not Found</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">{error || 'The requested blog post could not be located. It may have been moved or deleted.'}</p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-all duration-300 font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Return to Blog
        </Link>
      </motion.section>
    );
  }

  const htmlContent = editorJSToHtml(post.content);

  return (
    <>
      <SEO
        title={`${post.title} | Freedom M&A Blog`}
        description={post.meta_description || post.excerpt}
        canonicalUrl={`/blog/${post.slug}`}
        ogImage={post.image}
        ogType="article"
      />

      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
        <div
          className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)] transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <article className="bg-white min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 bg-gray-50/50">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

          <div className="container mx-auto max-w-4xl px-4 relative z-10 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 mb-8 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Articles
            </Link>

            <motion.div variants={fadeInUp} initial="initial" animate="animate">
              {post.category && (
                <span className="inline-block bg-red-100 text-red-600 text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-6">
                  {post.category}
                </span>
              )}

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-10 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs">
                      {post.author.charAt(0)}
                    </div>
                  </div>
                  <span className="text-gray-900">{post.author}</span>
                </div>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(post.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {post.read_time} min read
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        <div className="container mx-auto max-w-5xl px-4 -mt-8 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5 aspect-[21/9] bg-gray-100"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12" ref={mainContentRef}>

            {/* Left Sidebar (Share) */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-32 flex flex-col gap-4 items-center">
                <button onClick={handleLike} className="flex flex-col items-center gap-1 group w-full">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors border border-gray-100">
                    <Heart className={`h-5 w-5 ${likes > post.likes ? 'fill-red-500 text-red-500' : ''}`} />
                  </div>
                  <span className="text-xs font-medium text-gray-500">{likes}</span>
                </button>

                <button onClick={handleShare} className="flex flex-col items-center gap-1 group w-full">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors border border-gray-100">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">Share</span>
                </button>

                <a href="#comment-section" className="flex flex-col items-center gap-1 group w-full">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green-50 group-hover:text-green-500 transition-colors border border-gray-100">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-500">{comments.length}</span>
                </a>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 lg:px-8">
              <motion.article
                className="prose prose-lg prose-red max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 
                prose-p:text-gray-600 prose-p:leading-8
                prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-lg"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                {post.excerpt && (
                  <p className="lead text-xl text-gray-600 font-medium mb-10 not-prose border-l-4 border-red-500 pl-6 italic">
                    {post.excerpt}
                  </p>
                )}
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              </motion.article>

              {/* Tags */}
              <div className="mt-16 pt-8 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 py-1.5 px-4 rounded-full transition-colors duration-200 cursor-default"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mobile floating action bar */}
              <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg rounded-full px-6 py-3 flex items-center gap-8">
                <button onClick={handleLike} className="flex items-center gap-2 text-gray-600 active:text-red-500">
                  <Heart className={`h-5 w-5 ${likes > post.likes ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="font-semibold">{likes}</span>
                </button>
                <div className="w-px h-4 bg-gray-300"></div>
                <button onClick={handleShare} className="flex items-center gap-2 text-gray-600 active:text-blue-500">
                  <Share2 className="h-5 w-5" />
                </button>
                <div className="w-px h-4 bg-gray-300"></div>
                <a href="#comment-section" className="flex items-center gap-2 text-gray-600 active:text-green-500">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-semibold">{comments.length}</span>
                </a>
              </div>

              {/* Comments Section */}
              <div id="comment-section" className="mt-16 pt-16 border-t border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                  Comments <span className="text-gray-400 font-normal text-lg">({comments.length})</span>
                </h3>

                {/* Comment Form */}
                <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-12">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Leave a thoughtful comment</h4>
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="name"
                        value={commentForm.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                      />
                      <input
                        type="email"
                        name="email"
                        value={commentForm.email}
                        onChange={handleInputChange}
                        placeholder="Email (optional)"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                      />
                    </div>
                    <textarea
                      name="content"
                      value={commentForm.content}
                      onChange={handleInputChange}
                      placeholder="Share your thoughts..."
                      className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all h-32 resize-y"
                    />
                    {formError && <p className="text-sm text-red-500 font-medium">{formError}</p>}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                      >
                        Post Comment
                      </button>
                    </div>
                  </form>
                </div>

                {/* Comments List */}
                <div className="space-y-8">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id} className="group">
                        <div className="flex gap-4">
                          <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold border border-white shadow-sm">
                            {comment.user_name ? comment.user_name.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="font-semibold text-gray-900">{comment.user_name || 'Anonymous'}</h5>
                              <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-sm bg-white p-4 rounded-r-xl rounded-bl-xl border border-gray-100 shadow-sm group-hover:shadow-md transition-shadow">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white border-2 border-dashed border-gray-100 rounded-xl">
                      <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No discussion yet. Be the first to share your thoughts!</p>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Right Sidebar (Author & Related) */}
            <div className="lg:col-span-3 space-y-8">
              <div className="sticky top-32 space-y-8">

                {/* Author Card */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">About the Author</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xl">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{post.author}</h4>
                      <p className="text-xs text-gray-500">Editor & Writer</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {post.author_bio || "Passionate about technology and sharing knowledge through writing."}
                  </p>
                  <button className="w-full py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    View Profile
                  </button>
                </div>

                {/* Related Posts Micro */}
                {relatedPosts.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">More to Read</h3>
                    <div className="space-y-4">
                      {relatedPosts.map(p => (
                        <Link key={p.id} to={`/blog/${p.slug}`} className="block group">
                          <div className="flex gap-3">
                            <img src={p.image} alt="" className="w-20 h-14 object-cover rounded-lg bg-gray-100" />
                            <div>
                              <h5 className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                                {p.title}
                              </h5>
                              <span className="text-xs text-gray-400 mt-1 block">{p.read_time} min read</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </article>
    </>
  );
};

export default BlogPostPage;