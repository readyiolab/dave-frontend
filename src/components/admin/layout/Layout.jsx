import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout() {
  const location = useLocation();
  // Initialize sidebar state from localStorage
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true; // Default to open on desktop
  });
  
  // Set active menu based on current path
  const [activeMenu, setActiveMenu] = useState(() => {
    const path = location.pathname;
    if (path === '/admin') return 'Dashboard';
    if (path.includes('/admin/leads')) return 'Leads';
    if (path.includes('/admin/blogs')) return 'Blogs';
    if (path.includes('/admin/comments')) return 'Comments';
    if (path.includes('/admin/campaigns')) return 'Email Campaigns';
    if (path.includes('/admin/appointments')) return 'Appointments';
    if (path.includes('/admin/contacts')) return 'Contact';
    return 'Dashboard';
  });

  // Update active menu when location changes
  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin') setActiveMenu('Dashboard');
    else if (path.includes('/admin/leads')) setActiveMenu('Leads');
    else if (path.includes('/admin/blogs')) setActiveMenu('Blogs');
    else if (path.includes('/admin/comments')) setActiveMenu('Comments');
    else if (path.includes('/admin/campaigns')) setActiveMenu('Email Campaigns');
    else if (path.includes('/admin/appointments')) setActiveMenu('Appointments');
    else if (path.includes('/admin/contacts')) setActiveMenu('Contact');
  }, [location.pathname]);

  // Persist sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div
        className={`flex flex-col flex-1 h-full transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
        }`}
      >
        <Header
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
        />

        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
          <Outlet context={{ setActiveMenu }} />
        </main>

        <Footer />
      </div>
    </div>
  );
}
