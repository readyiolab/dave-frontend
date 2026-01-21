import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../components/hooks/useAuth';
import { api } from '../../components/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function Index() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Blogs
  const { data: blogData, isLoading: isLoadingBlogs, error: blogError } = useQuery({
    queryKey: ['blogsSummary'],
    queryFn: async () => {
      const response = await api.get('/blogs?page=1&pageSize=1');
      console.log("Blogs API response:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  // Appointments
  const { data: appointmentData, isLoading: isLoadingAppointments, error: appointmentError } = useQuery({
    queryKey: ['appointmentsSummary'],
    queryFn: async () => {
      const response = await api.get('/appointments/list?page=1&pageSize=1');
      console.log("Appointments API response:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  // Leads
  const { data: leadsData, isLoading: isLoadingLeads, error: leadsError } = useQuery({
    queryKey: ['leadsSummary'],
    queryFn: async () => {
      const response = await api.get('/leads?page=1&pageSize=1');
      console.log("Leads API response:", response.data);
      return Array.isArray(response.data) ? response.data : [];
    },
  });

  // Show toast only when error changes
  useEffect(() => {
    if (blogError || appointmentError || leadsError) {
      toast({
        title: 'Error',
        description: 'Failed to fetch summary data',
        variant: 'destructive',
      });
    }
  }, [blogError, appointmentError, leadsError, toast]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome, Admin
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Blogs */}
              <Card className="border-gray-200 shadow-sm bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-blue-900">Blogs</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingBlogs ? (
                    <div className="flex items-center justify-center h-16">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                    </div>
                  ) : blogError ? (
                    <p className="text-red-600 text-sm">Error loading blogs</p>
                  ) : (
                    <div>
                      <p className="text-3xl font-bold text-blue-900">{blogData?.length || 0}</p>
                      <p className="text-sm text-blue-700">Total blog posts</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Appointments */}
              {/* <Card className="border-gray-200 shadow-sm bg-green-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-green-900">Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingAppointments ? (
                    <div className="flex items-center justify-center h-16">
                      <Loader2 className="w-6 h-6 animate-spin text-green-400" />
                    </div>
                  ) : appointmentError ? (
                    <p className="text-red-600 text-sm">Error loading appointments</p>
                  ) : (
                    <div>
                      <p className="text-3xl font-bold text-green-900">{appointmentData?.length || 0}</p>
                      <p className="text-sm text-green-700">Total appointments</p>
                    </div>
                  )}
                </CardContent>
              </Card> */}

              {/* Leads */}
              <Card className="border-gray-200 shadow-sm bg-yellow-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-yellow-900">Leads</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoadingLeads ? (
                    <div className="flex items-center justify-center h-16">
                      <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
                    </div>
                  ) : leadsError ? (
                    <p className="text-red-600 text-sm">Error loading leads</p>
                  ) : (
                    <div>
                      <p className="text-3xl font-bold text-yellow-900">{leadsData?.length || 0}</p>
                      <p className="text-sm text-yellow-700">Total leads</p>
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
