import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../components/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import LeadsTable from '../../components/admin/Leads/LeadsTable';
import LeadDetails from '../../components/admin/Leads/LeadDetails';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedLead } from '../../components/store/slices/leadsSlice';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LeadsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { selectedLead } = useSelector((state) => state.leads);

  // Control sheet open state based on selectedLead
  const isSheetOpen = selectedLead !== null;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleCloseSheet = () => {
    dispatch(setSelectedLead(null));
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['leads', page, searchTerm, statusFilter],
    queryFn: async () => {
      try {
        const params = new URLSearchParams({
          page,
          pageSize,
          ...(searchTerm && { search: searchTerm }),
          ...(statusFilter !== 'all' && { status: statusFilter })
        });
        const response = await api.get(`/leads?${params.toString()}`);
        console.log('Full API Response:', response);
        console.log('Response Data:', response.data);
        
        // Handle different possible response structures
        let processedData;
        
        console.log('Response data type:', typeof response.data);
        console.log('Is response.data array:', Array.isArray(response.data));
        
        if (Array.isArray(response.data)) {
          // If response.data is directly an array
          console.log('Processing as direct array');
          processedData = {
            leads: response.data,
            total: response.data.length
          };
        } else if (response.data && Array.isArray(response.data.leads)) {
          // If response.data has a leads property that's an array
          console.log('Processing as nested leads array');
          processedData = {
            leads: response.data.leads,
            total: response.data.total || response.data.leads.length
          };
        } else if (response.data && Array.isArray(response.data.data)) {
          // If response.data has a data property that's an array
          console.log('Processing as nested data array');
          processedData = {
            leads: response.data.data,
            total: response.data.total || response.data.data.length
          };
        } else {
          // Default fallback
          console.log('Using fallback - no array found');
          console.log('Response.data structure:', response.data);
          processedData = {
            leads: [],
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
      description: `Failed to fetch leads: ${error.message}`, 
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load leads</h3>
              <p className="text-gray-600 mb-4">There was an error loading your leads. Please try again.</p>
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

  // Debug output - handle the case where data might be the raw array
  let leads, total;
  
  if (Array.isArray(data)) {
    // If data is directly an array (raw API response)
    leads = data;
    total = data.length;
    console.log('Data is direct array, leads:', leads.length);
  } else if (data && Array.isArray(data.leads)) {
    // If data has processed structure
    leads = data.leads;
    total = data.total || data.leads.length;
    console.log('Data has leads property, leads:', leads.length);
  } else {
    // Fallback
    leads = [];
    total = 0;
    console.log('Using fallback, no leads found');
  }
  
  console.log('Final leads array:', leads);
  console.log('Total count:', total);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">View and manage your leads</p>
        </div>
        
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">All Leads</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, total)} of {total} leads
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search leads..."
                  className="pl-9 w-full bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 bg-white">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                <p className="text-gray-600">There are no leads to display at the moment.</p>
              </div>
            ) : (
              <LeadsTable
                leads={leads}
                page={page}
                pageSize={pageSize}
                total={total}
                setPage={setPage}
              />
            )}
          </CardContent>
        </Card>

        {/* Lead Details Sheet */}
        <Sheet open={isSheetOpen} onOpenChange={(open) => !open && handleCloseSheet()}>
          <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-xl font-bold text-gray-900">
                Lead Details
              </SheetTitle>
              <SheetDescription>
                {selectedLead?.name} - {selectedLead?.email}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4">
              <LeadDetails />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
