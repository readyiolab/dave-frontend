import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../components/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import ContactsTable from '../../components/admin/Contactus/ContactsTable';

export default function ContactsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['contacts', page],
    queryFn: async () => {
      try {
        const response = await api.get(`/contacts?page=${page}&pageSize=${pageSize}`);
        console.log('Full API Response:', response);
        console.log('Response Data:', response.data);

        let processedData;

        console.log('Response data type:', typeof response.data);
        console.log('Is response.data array:', Array.isArray(response.data));

        // Simplify data processing to handle the expected structure
        if (response.data?.success && response.data.data && Array.isArray(response.data.data.contacts)) {
          console.log('Processing as nested data.contacts array');
          processedData = {
            contacts: response.data.data.contacts,
            total: response.data.data.total || response.data.data.contacts.length
          };
        } else {
          console.log('Using fallback - invalid data structure');
          console.log('Response.data structure:', response.data);
          processedData = {
            contacts: [],
            total: 0
          };
        }

        console.log('Processed Data:', processedData);
        return processedData;
      } catch (err) {
        console.error('API Error:', err);
        throw err;
      }
    },
  });

  console.log('Query Data:', data);
  console.log('Is Loading:', isLoading);
  console.log('Error:', error);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Query Error:', error);
    toast({ 
      title: 'Error', 
      description: `Failed to fetch contacts: ${error.message}`, 
      variant: 'destructive' 
    });
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load contacts</h3>
              <p className="text-gray-600 mb-4">There was an error loading your contacts. Please try again.</p>
              <p className="text-sm text-gray-500 mb-4">Error: {error.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Simplify data extraction
  const contacts = data?.contacts || [];
  const total = data?.total || 0;
  console.log('Final contacts array:', contacts);
  console.log('Total count:', total);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Contact Us Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage contact us submissions</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Card className="col-span-1 shadow-sm border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">All Contact Submissions</CardTitle>
              <p className="text-sm text-gray-600">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} contacts
              </p>
            </CardHeader>
            <CardContent>
              {contacts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
                  <p className="text-gray-600">There are no contact submissions to display at the moment.</p>
                </div>
              ) : (
                <ContactsTable
                  contacts={contacts}
                  page={page}
                  pageSize={pageSize}
                  total={total}
                  setPage={setPage}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}