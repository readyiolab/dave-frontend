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
          return `<p class="text-gray-700 leading-relaxed mb-4">${block.data.text || ""}</p>`;

        case "header":
          const level = block.data.level || 2;
          return `<h${level} class="text-gray-800 font-bold mt-6 mb-3 ${level === 1 ? "text-3xl" : level === 2 ? "text-2xl" : "text-xl"
            }">${block.data.text || ""}</h${level}>`;

        case "list":
          const tag = block.data.style === "ordered" ? "ol" : "ul";
          const items = (block.data.items || [])
            .map((item: string) => `<li class="text-gray-700 mb-1">${item}</li>`)
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
                      <span>${item.text}</span>
                  </li>`
              )
              .join("") +
            `</ul>`
          );

        case "quote":
          return `<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">
                    ${block.data.text || ""}
                    <footer class="mt-2 text-sm text-gray-500">— ${block.data.caption || ""
            }</footer>
                  </blockquote>`;

        case "code":
          return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code>${block.data.code ||
            ""}</code></pre>`;

        case "embed":
          return `<div class="my-6">
                    <iframe class="w-full h-64 rounded-lg shadow-md"
                      src="${block.data.embed}"
                      frameborder="0"
                      allowfullscreen></iframe>
                    <p class="text-center text-sm text-gray-500 mt-2">${block.data.caption || ""
            }</p>
                  </div>`;

        case "table":
          const rows = block.data.content
            .map(
              (row: string[]) =>
                `<tr>${row
                  .map(
                    (cell) =>
                      `<td class="border px-3 py-2 text-gray-700">${cell}</td>`
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
                         alt="${block.data.caption || "Image"}" 
                         class="w-full max-w-xl h-auto rounded-xl shadow-md mx-auto object-cover" />
                    <figcaption class="text-center text-sm text-gray-600 mt-2">${block.data.caption || ""
            }</figcaption>
                  </figure>`;

        case "raw":
          return block.data.html || "";

        case "marker": // inline plugin → better handled via editor config, but fallback here
          return `<mark>${block.data.text || ""}</mark>`;

        case "underline":
          return `<u>${block.data.text || ""}</u>`;

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
        className="py-16 bg-white text-center min-h-screen flex flex-col justify-center"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Blog Post Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The requested blog post does not exist.'}</p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-full hover:from-pink-500 hover:to-red-500 transition-all duration-300"
          aria-label="Return to blog homepage"
        >
          Back to Blog
        </Link>
      </motion.section>
    );
  }

  const htmlContent = editorJSToHtml(post.content);

  return (
    <>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <SEO
        title={`${post.title} | Freedom M&A Blog`}
        description={post.meta_description || post.excerpt}
        canonicalUrl={`/blog/${post.slug}`}
        ogImage={post.image}
        ogType="article"
      />

      <section className="pb-10 bg-white">
        <div className="container mx-auto max-w-5xl px-4">

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-red-500 mb-6"
            aria-label="Go back to blog homepage"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <motion.h1
            className="text-4xl font-bold text-gray-800 mb-4"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            {post.title}
          </motion.h1>


          <img
            src={post.image}
            alt={`${post.title} - Blog cover`}
            className="w-auto h-auto  object-fill  shadow-lg"
          />

          <motion.header variants={fadeInUp} initial="initial" animate="animate">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-6 ">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-red-500" />
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-red-500" />
                {post.read_time} min read
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4 text-red-500" />
                {post.author}
              </div>
            </div>
          </motion.header>

          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10"
            ref={mainContentRef}
          >
            {/* Main Content (Left Side) */}
            <div className="lg:col-span-2 pr-0 lg:pr-8">
              <motion.div variants={fadeInUp} initial="initial" animate="animate">
                <article className="prose prose-lg max-w-none text-gray-700">
                  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </article>
                <div className="flex flex-wrap gap-3 mt-10">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm text-gray-600 bg-gray-100 py-1 px-4 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors duration-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-10 flex items-center gap-8 border-t pt-8">
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Heart className="h-5 w-5" /> {likes}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Share2 className="h-5 w-5" /> {shares}
                  </button>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageSquare className="h-5 w-5" /> {comments.length}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar (Right Side) - Sticky */}
            <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit space-y-8">
              <motion.div
                className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-4"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">About the Author</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{post.author}</p>
                    <p className="text-sm text-gray-600">{post.author_bio}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                id="comment-section"
                className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
                variants={fadeInUp}
                initial="initial"
                animate="animate"
              >
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Leave a Comment</h2>
                <form className="space-y-4 mb-6" onSubmit={handleCommentSubmit}>
                  <input
                    type="text"
                    name="name"
                    value={commentForm.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  />
                  <input
                    type="email"
                    name="email"
                    value={commentForm.email}
                    onChange={handleInputChange}
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
                  />
                  <textarea
                    name="content"
                    value={commentForm.content}
                    onChange={handleInputChange}
                    placeholder="Your Comment"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white h-32"
                  />
                  {formError && <p className="text-sm text-red-500">{formError}</p>}
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:from-pink-500 hover:to-red-500 transition-all duration-300 w-full justify-center"
                  >
                    Submit <Send className="h-4 w-4" />
                  </button>
                </form>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Comments ({comments.length})
                </h2>
                {comments.length > 0 ? (
                  <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-t pt-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {comment.user_name || 'Anonymous'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No comments yet. Be the first!</p>
                )}
              </motion.div>
            </aside>
          </div>

          {relatedPosts.length > 0 && (
            <motion.section
              className="mt-16"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <motion.article
                    key={relatedPost.id}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                    variants={fadeInUp}
                  >
                    <Link to={`/blog/${relatedPost.slug}`} aria-label={`Read ${relatedPost.title}`}>
                      <img
                        src={relatedPost.image}
                        alt={`${relatedPost.title} - Related blog post`}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="p-5">
                        <span className="text-xs font-medium text-red-500 mb-2 block">
                          {relatedPost.category}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-red-500 transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogPostPage;