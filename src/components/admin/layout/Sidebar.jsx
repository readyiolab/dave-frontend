import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, MessageSquare, Mail, Calendar, BarChart, X, Menu, Phone } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/admin/leads', label: 'Leads', icon: <Users className="w-5 h-5" /> },
    { path: '/admin/blogs', label: 'Blogs', icon: <FileText className="w-5 h-5" /> },
    ...(isAdmin ? [{ path: '/admin/comments', label: 'Comments', icon: <MessageSquare className="w-5 h-5" /> }] : []),
    { path: '/admin/campaigns', label: 'Email Campaigns', icon: <Mail className="w-5 h-5" /> },
    { path: '/admin/chat', label: 'AI Chat', icon: <MessageSquare className="w-5 h-5" /> },
    { path: '/admin/voice-calls', label: 'AI Voice Calls', icon: <Phone className="w-5 h-5" /> },
    // { path: '/admin/appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" /> },
    {path : '/admin/contacts', label: 'Contact', icon: <Phone className="w-5 h-5" /> },
    // { path: '/admin/metrics', label: 'Metrics', icon: <BarChart className="w-5 h-5" /> },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
      <aside
      className={`bg-gray-900 text-white border-r border-gray-700 transition-all duration-300 fixed left-0 top-0 h-full z-20 overflow-x-hidden box-border ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
      <div className="flex justify-between items-center p-4 border-b border-gray-700 h-16 box-border">
          {isSidebarOpen && <span className="text-lg font-semibold truncate">Menu</span>}
          <Button
            variant="ghost"
            className="text-white hover:bg-gray-800"
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
        
      <nav className="p-2 h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden box-border">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path} className="relative group">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                  `flex items-center p-2 rounded transition-colors w-full box-border ${
                          isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  } ${isSidebarOpen ? '' : 'justify-center'}`
                      }
                    >
                <div className="relative flex items-center">
                        {item.icon}
                  {!isSidebarOpen && (
                    <span className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 p-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-100">
                      {item.label}
                    </span>
                  )}
                </div>
                {isSidebarOpen && <span className="ml-3 truncate">{item.label}</span>}
              </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
  );
}