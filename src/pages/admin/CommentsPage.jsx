import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../components/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import CommentTable from '../../components/admin/Comments/CommentTable';

export default function CommentsPage() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const { toast } = useToast();

  const { data, isLoading, error } = useQuery({
    queryKey: ['comments', page],
    queryFn: async () => {
      const response = await api.get(`/comments?page=${page}&pageSize=${pageSize}`);
      return response.data;
    },
  });

  if (isLoading) return <div className="text-black">Loading...</div>;
  if (error) {
    toast({ title: 'Error', description: 'Failed to fetch comments', variant: 'destructive' });
    return <div className="text-black">Error loading comments</div>;
  }

  return (
    <Card className="border-black">
      <CardHeader>
        <CardTitle className="text-black">Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <CommentTable
          comments={data?.comments || []}
          page={page}
          pageSize={pageSize}
          total={data?.total || 0}
          setPage={setPage}
        />
      </CardContent>
    </Card>
  );
}