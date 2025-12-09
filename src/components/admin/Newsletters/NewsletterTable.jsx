import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

export default function NewsletterTable({ newsletters, page, pageSize, total, setPage }) {
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendMutation = useMutation({
    mutationFn: async (newsletterId) => {
      const csrfToken = await api.get('/auth/csrf').then(res => res.data.csrfToken);
      await api.post(`/newsletters/send/${newsletterId}`, { _csrf: csrfToken });
      await api.post('/admin/audit', { action: 'send_newsletter', metadata: { newsletterId, userId: user?.id }, data: { _csrf: csrfToken } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['newsletters']);
      toast({ title: 'Success', description: 'Newsletter sent' });
    },
    onError: () => toast({ title: 'Error', description: 'Failed to send newsletter', variant: 'destructive' }),
  });

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <Table className="border-black">
        <TableHeader>
          <TableRow>
            <TableHead className="text-black">Subject</TableHead>
            <TableHead className="text-black">Scheduled Date</TableHead>
            <TableHead className="text-black">Status</TableHead>
            <TableHead className="text-black">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {newsletters.map((newsletter) => (
            <TableRow key={newsletter.id}>
              <TableCell className="text-black">{newsletter.subject}</TableCell>
              <TableCell className="text-black">{new Date(newsletter.scheduled_date).toLocaleDateString()}</TableCell>
              <TableCell className="text-black">{newsletter.status}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="border-black text-black hover:bg-black hover:text-white"
                  onClick={() => sendMutation.mutate(newsletter.id)}
                  disabled={sendMutation.isLoading || newsletter.status === 'sent'}
                >
                  {sendMutation.isLoading ? 'Sending...' : 'Send Now'}
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

NewsletterTable.propTypes = {
  newsletters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      subject: PropTypes.string.isRequired,
      scheduled_date: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['draft', 'scheduled', 'sent']).isRequired,
    })
  ).isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
};