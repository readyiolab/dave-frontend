import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import Chatbot from "./Chatbot";

const PublicLayout = () => {
  return (
    <div className="min-h-screen relative bg-white">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
      <div className="fixed top-10 right-4 z-50">
        <Chatbot />
      </div>
    </div>
  );
};

export default PublicLayout;