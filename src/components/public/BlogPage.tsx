import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  X,
  Heart,
  Share2,
  MessageSquare,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Helmet } from 'react-helmet';
import { getAllBlogs } from '../lib/api';
import HeroSection from './HeroSection';

import { Card } from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const postsPerPage = 6;
  const blogSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const { data } = await getAllBlogs();
        setBlogPosts(
          data.map((post: any) => ({
            id: post.id,
            title: post.title,
            slug: post.slug || generateSlug(post.title),
            excerpt: post.excerpt || '',
            metaDescription: post.meta_description || post.excerpt || '',
            content: post.content,
            image: post.image || 'https://via.placeholder.com/400',
            author: post.author || 'Unknown',
            author_bio: post.author_bio || '',
            readTime: `${post.read_time || 5} min read`,
            category: typeof post.category === 'string'
              ? post.category.split(',')[0] || 'Uncategorized'
              : Array.isArray(post.category)
                ? post.category[0] || 'Uncategorized'
                : 'Uncategorized',
            tags: Array.isArray(post.tags)
              ? post.tags
              : typeof post.tags === 'string'
                ? JSON.parse(post.tags || '[]')
                : [],
            isFeatured: post.is_featured || 0,
            likes: post.likes || 0,
            shares: post.shares || 0,
            comments_count: post.comments_count || 0,
            publishedAt: post.published_at || post.created_at,
          }))
        );
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load blog posts');
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // Reset to page 1 when search or category changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory]);

  const generateSlug = (title: string): string =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const categories = [
    {
      name: 'All',
      icon: <BookOpen className="w-4 h-4" />,
      count: blogPosts.length,
    },
    ...Array.from(new Set(blogPosts.map((post) => post.category))).map((category) => ({
      name: category,
      icon: <BookOpen className="w-4 h-4" />,
      count: blogPosts.filter((post) => post.category === category).length,
    })),
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const recentPosts = blogPosts
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice((page - 1) * postsPerPage, page * postsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      if (blogSectionRef.current) {
        blogSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Generate pagination buttons with ellipsis
  const generatePaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    if (totalPages <= maxVisibleButtons) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      // Show pagination with ellipsis
      if (page <= 3) {
        // Show first 3, ellipsis, last
        buttons.push(1, 2, 3, '...', totalPages);
      } else if (page >= totalPages - 2) {
        // Show first, ellipsis, last 3
        buttons.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Show first, ellipsis, current-1, current, current+1, ellipsis, last
        buttons.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    
    return buttons;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#d3d6db]">
        <section className="py-16 sm:py-20 bg-[#d3d6db]">
          <div className="container px-4 sm:px-6 md:px-8">
            <div className="animate-pulse">
              <div className="h-10 w-48 bg-[#3a4750]/20 rounded mb-6 mx-auto"></div>
              <div className="h-6 w-3/4 bg-[#3a4750]/20 rounded mb-4 mx-auto"></div>
              <div className="h-12 w-full bg-[#3a4750]/20 rounded mb-8"></div>
              <div className="flex flex-wrap gap-3 justify-center">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="h-10 w-32 bg-[#3a4750]/20 rounded-full"></div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#d3d6db]">
        <section className="py-16 sm:py-20 bg-[#d3d6db] text-center">
          <h2 className="text-3xl font-bold text-[#303841] mb-4">Error</h2>
          <p className="text-[#3a4750] mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#be3144] to-[#e63950] text-white px-6 py-3 rounded-lg hover:from-[#e63950] hover:to-[#be3144] transition-all duration-300"
          >
            Back to Home
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d3d6db]">
      <Helmet>
        <title>Blog - Freedom Mergers & Acquisitions</title>
        <meta name="description" content="Explore expert articles, guides, and insights to empower your business transition with Freedom Mergers & Acquisitions." />
      </Helmet>

      <HeroSection
        title="Insights & Strategies for Founders"
        subtitle="Explore expert articles, guides, and case studies designed to help you navigate growth, transitions, and financial freedom with confidence."
        ctaPrimary="Read Latest Articles"
        ctaSecondary="Browse Categories"
        ctaPrimaryLink="#latest-blogs"
        ctaSecondaryLink="#categories"
      />

      {/* Search and Categories Section */}
      <section className="py-16 sm:py-20 bg-[#d3d6db]">
        <div className="container px-4 sm:px-6 md:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#303841] mb-4">
              Explore Our
              <span
                className="block text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(to right, #be3144, #e63950)',
                }}
              >
                Blog Content
              </span>
            </h2>
            <p className="text-lg text-[#3a4750] max-w-2xl mx-auto leading-relaxed">
              Discover articles crafted by industry experts to help you stay ahead in the business world.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} className="relative max-w-4xl mx-auto mb-8">
            <div className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#3a4750] w-5 h-5" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-[#3a4750]/20 focus:outline-none focus:ring-2 focus:ring-[#be3144] focus:border-transparent text-[#303841] placeholder-[#3a4750]/50 bg-white"
                aria-label="Search blog posts"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#3a4750] hover:text-[#be3144]"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="flex flex-wrap gap-3 justify-center"
          >
            {categories.map((category, index) => (
              <motion.button
                key={index}
                variants={fadeInUp}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 group relative ${selectedCategory === category.name
                    ? 'bg-white text-[#303841] shadow-lg border border-[#be3144]/50'
                    : 'bg-white text-[#3a4750] hover:bg-[#be3144]/10 border border-[#3a4750]/20'
                  }`}
                aria-label={`Filter by ${category.name}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#be3144]/10 to-[#e63950]/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-2">
                  {category.icon}
                  <span>{category.name}</span>
                  <span className="text-xs bg-[#3a4750]/10 text-[#3a4750] px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section ref={blogSectionRef} id="latest-blogs" className="py-16 sm:py-20 bg-[#303841]">
        <div className="container px-4 sm:px-6 md:px-8">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Dive Into Our
              <span className="block bg-gradient-to-r from-[#be3144] to-[#e63950] bg-clip-text text-transparent">
                Expert Insights
              </span>
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Comprehensive articles designed to empower you with actionable knowledge and strategies.
            </p>
            {filteredPosts.length > 0 && (
              <p className="text-sm text-white/60 mt-4">
                Showing {((page - 1) * postsPerPage) + 1} - {Math.min(page * postsPerPage, filteredPosts.length)} of {filteredPosts.length} posts
              </p>
            )}
          </motion.div>

          {filteredPosts.length === 0 ? (
            <motion.div {...fadeInUp} className="text-center py-20">
              <div className="max-w-2xl mx-auto">
                {blogPosts.length === 0 ? (
                  <>
                    <div className="mb-8">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block"
                      >
                        <BookOpen className="w-20 h-20 text-[#be3144] mx-auto mb-6" />
                      </motion.div>
                    </div>
                    <h3 className="text-4xl font-bold text-white mb-4">Coming Soon!</h3>
                    <p className="text-white/80 mb-6 text-lg leading-relaxed">
                      We're crafting amazing content to help you succeed. Our expert insights and strategies will be available very soon.
                    </p>
                    <div className="bg-gradient-to-r from-[#be3144]/20 to-[#e63950]/20 rounded-2xl p-8 mb-8 border border-[#be3144]/30">
                      <p className="text-white/90 mb-4 font-medium">Check back soon for:</p>
                      <ul className="text-white/80 space-y-2 mb-6">
                        <li className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-[#be3144] rounded-full"></div>
                          Expert articles on M&A strategies
                        </li>
                        <li className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-[#be3144] rounded-full"></div>
                          Founder success stories and case studies
                        </li>
                        <li className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-[#be3144] rounded-full"></div>
                          Financial planning and growth guides
                        </li>
                        <li className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-[#be3144] rounded-full"></div>
                          Industry insights and market trends
                        </li>
                      </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        className="group bg-gradient-to-r from-[#be3144] to-[#e63950] text-white font-semibold py-3 px-8 rounded-lg hover:from-[#e63950] hover:to-[#be3144] transition-all duration-300 transform hover:scale-105"
                        aria-label="Notify me"
                      >
                        Notify Me When Ready
                      </button>
                      <Link
                        to="/"
                        className="group bg-white/10 border border-white/30 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                      >
                        Back to Home
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <Search className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-4">No posts found</h3>
                    <p className="text-white/70 mb-6">
                      Try adjusting your search terms or browse different categories.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                      }}
                      className="bg-gradient-to-r from-[#be3144] to-[#e63950] text-white px-6 py-3 rounded-lg hover:from-[#e63950] hover:to-[#be3144] transition-all duration-300"
                    >
                      Clear Filters
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {paginatedPosts.map((post) => (
                  <motion.article key={post.id} variants={fadeInUp} className="group relative">
                    <Card className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-[#3a4750]/10">
                      <div className="relative overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#303841]/50 to-transparent"></div>
                        <div className="absolute top-3 right-3 flex gap-2">
                          {post.isFeatured === 1 && (
                            <span className="bg-gradient-to-r from-[#be3144] to-[#e63950] text-white px-2 py-1 rounded-full text-xs font-semibold">
                              Featured
                            </span>
                          )}
                          <span className="bg-white/90 text-[#303841] px-2 py-1 rounded-full text-xs font-semibold">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-[#303841] mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-[#3a4750] text-sm mb-5 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="space-y-2 mb-5">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-[#be3144] flex-shrink-0" />
                            <span className="text-[#3a4750] text-sm">{post.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#be3144] flex-shrink-0" />
                            <span className="text-[#3a4750] text-sm">
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#be3144] flex-shrink-0" />
                            <span className="text-[#3a4750] text-sm">{post.readTime}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-5">
                          <div className="flex flex-wrap gap-1">
                            {post.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="bg-[#3a4750]/10 text-[#3a4750] px-2 py-1 rounded text-xs"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <Link
                            to={`/blog/${post.slug}`}
                            className="w-32 py-2 rounded-xl font-semibold text-base text-center text-white bg-gradient-to-r from-[#be3144] to-[#e63950] hover:from-[#e63950] hover:to-[#be3144] transition-all duration-300 hover:scale-105"
                            aria-label={`Read more about ${post.title}`}
                          >
                            Read More
                          </Link>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-[#3a4750]">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-[#be3144]" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="w-4 h-4 text-[#be3144]" />
                            <span>{post.shares}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4 text-[#be3144]" />
                            <span>{post.comments_count}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.article>
                ))}
              </motion.div>

              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  <motion.div
                    {...fadeInUp}
                    className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#3a4750]/10"
                  >
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-[#303841] mb-4">Recent Posts</h3>
                      <div className="space-y-4">
                        {recentPosts.map((post) => (
                          <Link
                            key={post.id}
                            to={`/blog/${post.slug}`}
                            className="flex gap-4 group hover:bg-[#be3144]/10 p-2 rounded-xl transition-colors duration-300 w-full text-left"
                            aria-label={`Read recent post: ${post.title}`}
                          >
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                              loading="lazy"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-[#303841] text-sm line-clamp-2 group-hover:text-[#be3144] transition-colors duration-300">
                                {post.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1 text-xs text-[#3a4750]">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    {...fadeInUp}
                    className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#3a4750]/10"
                  >
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold text-[#303841] mb-4">Popular Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'SEO',
                          'Social Media',
                          'Content Marketing',
                          'Web Development',
                          'Analytics',
                          'Digital Marketing Course',
                          'Job Guarantee',
                        ].map((tag, index) => (
                          <span
                            key={index}
                            className="bg-[#3a4750]/10 hover:bg-[#be3144]/20 text-[#3a4750] hover:text-[#be3144] px-3 py-2 rounded-full text-sm cursor-pointer transition-colors duration-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <motion.div {...fadeInUp} className="flex justify-center mt-12">
              <div className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-lg">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-[#3a4750]/20 text-[#3a4750] hover:bg-[#be3144]/10 hover:border-[#be3144]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {generatePaginationButtons().map((pageNum, index) => (
                    pageNum === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-2 text-[#3a4750]">
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum as number)}
                        className={`w-10 h-10 rounded-xl font-medium transition-all duration-300 ${
                          page === pageNum
                            ? 'bg-gradient-to-r from-[#be3144] to-[#e63950] text-white shadow-lg'
                            : 'text-[#3a4750] hover:bg-[#be3144]/10 hover:text-[#be3144]'
                        }`}
                        aria-label={`Go to page ${pageNum}`}
                        aria-current={page === pageNum ? 'page' : undefined}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl border border-[#3a4750]/20 text-[#3a4750] hover:bg-[#be3144]/10 hover:border-[#be3144]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-r from-[#be3144] to-[#e63950] relative">
        <div
          className="absolute inset-0 bg-black/10"
          aria-hidden="true"
        ></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Define Your <span>Freedom</span>?
            </h2>
            <p className="text-base sm:text-lg text-white/90 mb-8 leading-relaxed">
              Join over 500 founders who have transformed their futures with
              Freedom M&A. Take the first step toward personal and financial
              freedom today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="group bg-white text-[#303841] hover:bg-[#d3d6db] font-semibold text-base py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                aria-label="Schedule Consultation"
              >
                <Calendar
                  className="w-4 h-4 mr-2 inline"
                  aria-hidden="true"
                />
                Schedule Consultation
                <ArrowRight
                  className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                />
              </button>
              <button
                className="group border-2 border-white text-white hover:bg-white hover:text-[#303841] font-semibold text-base py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                aria-label="Download Our Guide"
              >
                <Download
                  className="w-4 h-4 mr-2 inline"
                  aria-hidden="true"
                />
                Download Our Guide
              </button>
            </div>
            <div className="mt-8 pt-6 border-t border-white/20 text-center">
              <p className="text-white/80 text-sm">
                180-day exclusive contracts • Success-based fee structure •
                Complete transparency
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;