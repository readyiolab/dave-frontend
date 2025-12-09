import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, Users, FileText, MessageSquare, Mail, Calendar, BarChart } from 'lucide-react';

export default function Index() {
  const { user } = useAuth();

  const quickActions = [
    { label: 'Create Blog', path: '/admin/blogs', icon: <FileText className="w-6 h-6" /> },
    { label: 'Manage Leads', path: '/admin/leads', icon: <Users className="w-6 h-6" /> },
    { label: 'View Metrics', path: '/admin/metrics', icon: <BarChart className="w-6 h-6" /> },
    { label: 'Schedule Appointment', path: '/admin/appointments', icon: <Calendar className="w-6 h-6" /> },
  ];

  return (
    <div className="space-y-6">
      <Card className="border-gray-300 bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">
            Welcome, {user?.username} ({user?.role})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Manage your admin tasks efficiently. Use the sidebar to navigate or select a quick action below.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Card key={action.path} className="border-gray-300 hover:shadow-lg transition-shadow">
            <CardContent className="flex flex-col items-center p-6">
              <div className="text-blue-600 mb-4">{action.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{action.label}</h3>
              <Button
                asChild
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <Link to={action.path}>Go to {action.label}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-gray-300 bg-white">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Quick Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">23</p>
              <p className="text-gray-600">Active Blogs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">45</p>
              <p className="text-gray-600">Leads</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">12</p>
              <p className="text-gray-600">Appointments</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">89</p>
              <p className="text-gray-600">Newsletter Subscribers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}