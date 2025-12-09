import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../components/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import AppointmentTable from '../../components/admin/Appointments/AppointmentTable';

export default function AppointmentsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['appointments', page],
    queryFn: async () => {
      const response = await api.get(`/appointments/list?page=${page}&pageSize=${pageSize}`);
      return response.data;
    },
  });

  if (isLoading) return <div className="text-black">Loading...</div>;
  if (error) {
    toast({ title: 'Error', description: 'Failed to fetch appointments', variant: 'destructive' });
    return <div className="text-black">Error loading appointments</div>;
  }

  return (
    <Card className="border-black">
      <CardHeader>
        <CardTitle className="text-black">Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <AppointmentTable
          appointments={data?.appointments || []}
          page={page}
          pageSize={pageSize}
          total={data?.total || 0}
          setPage={setPage}
        />
      </CardContent>
    </Card>
  );
}