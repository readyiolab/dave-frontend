import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../components/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import MetricsDisplay from '../../components/admin/Metrics/MetricsDisplay';

export default function MetricsPage() {
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const response = await api.get('/metrics');
      return response.data;
    },
  });

  if (isLoading) return <div className="text-black">Loading...</div>;
  if (error) {
    toast({ title: 'Error', description: 'Failed to fetch metrics', variant: 'destructive' });
    return <div className="text-black">Error loading metrics</div>;
  }

  return (
    <Card className="border-black">
      <CardHeader>
        <CardTitle className="text-black">Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <MetricsDisplay metrics={data || {}} />
      </CardContent>
    </Card>
  );
}