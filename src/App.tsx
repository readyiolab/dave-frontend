import React, { Suspense, lazy } from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { useAuth } from "./components/hooks/useAuth";


// Lazy load components
const PublicLayout = lazy(() => import("./components/public/PublicLayout"));
const Home = lazy(() => import("./components/public/Home"));
const About = lazy(() => import("./components/public/About"));
const Services = lazy(() => import("./components/public/Services"));
const DaveMarshall = lazy(() => import("./components/public/DaveMarshall"));
const Contact = lazy(() => import("./components/public/Contact"));
const Blog = lazy(() => import("./components/public/BlogPage"));
const BlogPost = lazy(() => import("./components/public/BlogPostPage"));
const SearchResults = lazy(() => import("./components/public/SearchResults"));
const Layout = lazy(() => import("./components/admin/layout/Layout"));
const Login = lazy(() => import("./components/admin/Auth/Login"));
const Index = lazy(() => import("./pages/admin/Index"));
const LeadsPage = lazy(() => import("./pages/admin/LeadsPage"));
const BlogsPage = lazy(() => import("./pages/admin/BlogsPage"));
const CommentsPage = lazy(() => import("./pages/admin/CommentsPage"));
const NewslettersPage = lazy(() => import("./pages/admin/NewslettersPage"));
const AppointmentsPage = lazy(() => import("./pages/admin/AppointmentsPage"));
const ContactsPage = lazy(() => import("./pages/admin/ContactsPage"));
const MetricsPage = lazy(() => import("./pages/admin/MetricsPage"));
const NotFound = lazy(() => import("./components/public/NotFound"));

// Loader Component
const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#d3d6db]">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 border-[#3a4750] border-t-[#be3144] rounded-full animate-spin"></div>
      <div className="absolute inset-2 border-4 border-[#303841] border-t-[#be3144] rounded-full animate-spin animation-delay-200"></div>
    </div>
  </div>
);

// Redirect Component for handling ?s= queries
const SearchRedirect = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("s");
  if (query) {
    return <Navigate to={`/search?s=${encodeURIComponent(query)}`} replace />;
  }
  return <Navigate to="/" replace />;
};

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white text-black">
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/admin" /> : <Login />}
            />
            <Route
              path="/admin"
              element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
            >
              <Route index element={<Index />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="blogs" element={<BlogsPage />} />
              <Route path="comments" element={<CommentsPage />} />
              <Route path="newsletters" element={<NewslettersPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="contacts" element={<ContactsPage />} />
              <Route path="metrics" element={<MetricsPage />} />
            </Route>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/dave" element={<DaveMarshall />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              
              <Route path="/search" element={<SearchResults />} />
              <Route path="/?s" element={<SearchRedirect />} /> 
            </Route>
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}