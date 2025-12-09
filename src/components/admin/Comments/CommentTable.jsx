import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export default function CommentTable({ comments, page, pageSize, total, setPage }) {
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (commentId) => {
      const csrfToken = await api.get('/auth/csrf').then(res => res.data.csrfToken);
      await api.delete(`/comments/${commentId}`, { data: { _csrf: csrfToken } });
      await api.post('/admin/audit', { action: 'delete_comment', metadata: { commentId, userId: user?.id }, data: { _csrf: csrfToken } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
      toast({ title: 'Success', description: 'Comment deleted' });
    },
    onError: () => toast({ title: 'Error', description: 'Failed to delete comment', variant: 'destructive' }),
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <Table className="border-black">
        <TableHeader>
          <TableRow>
            <TableHead className="text-black">Blog Title</TableHead>
            <TableHead className="text-black">Comment</TableHead>
            <TableHead className="text-black">User</TableHead>
            <TableHead className="text-black">Date</TableHead>
            <TableHead className="text-black">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.map((comment) => (
            <TableRow key={comment.id}>
              <TableCell className="text-black">{comment.blog_title}</TableCell>
              <TableCell className="text-black">{comment.content}</TableCell>
              <TableCell className="text-black">{comment.user_name}</TableCell>
              <TableCell className="text-black">{new Date(comment.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="border-black text-black hover:bg-black hover:text-white"
                  onClick={() => deleteMutation.mutate(comment.id)}
                  disabled={deleteMutation.isLoading}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage(page > 1 ? page - 1 : 1)}
              className="border-black text-black hover:bg-black hover:text-white"
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setPage(i + 1)}
                isActive={page === i + 1}
                className={page === i + 1 ? 'bg-black text-white' : 'border-black text-black hover:bg-black hover:text-white'}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
              className="border-black text-black hover:bg-black hover:text-white"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

CommentTable.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      blog_title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      user_name: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
    })
  ).isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};