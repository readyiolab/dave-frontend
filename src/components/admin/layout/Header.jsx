
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Header({ setIsSidebarOpen, isSidebarOpen, activeMenu }) {
  const { handleLogout, user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm p-4 flex justify-between items-center h-16 flex-shrink-0 backdrop-blur-sm bg-white/95">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
            {activeMenu}
          </h1>
          <p className="text-xs text-gray-500 hidden sm:block">Freedom Mergers Admin</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
       
        <Button
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-700 flex items-center space-x-2 text-sm transition-all duration-200 px-2 sm:px-4"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
